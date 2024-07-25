import { useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import html2pdf from 'html2pdf.js';
import { learningFirestore, learningstorage } from '../../../../../learningUtils/firebaseConfig';

const fetchLastInvoiceNumber = async () => {
  try {
    const docRef = doc(learningFirestore, 'invoiceNumbers', 'lastInvoice');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().lastInvoiceNumber;
    } else {
      await setDoc(docRef, { lastInvoiceNumber: 'PZ-2400' });
      return 'PZ-2400'; // Initial invoice if none exists
    }
  } catch (error) {
    console.error('Error fetching last invoice number:', error);
    return null;
  }
};

const generateInvoiceNumber = async () => {
  const lastInvoiceNumber = await fetchLastInvoiceNumber();
  if (!lastInvoiceNumber) {
    throw new Error('Could not fetch last invoice number');
  }
  const [prefix, numberPart] = lastInvoiceNumber.split('-');
  const newNumber = String(Number(numberPart) + 1).padStart(4, '0'); // Pad the number part with zeros
  return `${prefix}-${newNumber}`;
};

const formatDate = (dateOrTimestamp) => {
  let date;

  if (dateOrTimestamp instanceof Date) {
    date = dateOrTimestamp;
  } else if (typeof dateOrTimestamp.toDate === 'function') {
    date = dateOrTimestamp.toDate();
  } else if (typeof dateOrTimestamp === 'number') {
    date = new Date(dateOrTimestamp);
  } else {
    date = new Date(dateOrTimestamp.seconds * 1000); // Assuming Firestore Timestamp
  }

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const checkIfInvoiceExists = async (userId, courseId) => {
  const invoicesQuery = query(
    collection(learningFirestore, `invoices/${userId}/history`),
    where("courseId", "==", courseId)
  );

  const invoiceDocs = await getDocs(invoicesQuery);
  return !invoiceDocs.empty;
};

let isGeneratingInvoice = false; // Flag to prevent multiple saves

const generateAndSaveInvoice = async (user, course, refs, setLoading) => {
  if (isGeneratingInvoice) {
    console.warn("Invoice generation is already in progress. Skipping duplicate generation.");
    return;
  }

  isGeneratingInvoice = true;
  try {
    if (!user || !user.uid || !course || !course.courseId) {
      console.error("Invalid user or course ID");
      isGeneratingInvoice = false;
      return;
    }

    // Fetch paymentId and orderId from Firestore
    const courseDocRef = doc(learningFirestore, `users/${user.uid}/courses/${course.courseId}`);
    const courseDocSnap = await getDoc(courseDocRef);

    if (courseDocSnap.exists()) {
      course.paymentId = courseDocSnap.data().paymentId;
      course.orderId = courseDocSnap.data().orderId;
    } else {
      console.error("No such document!");
      isGeneratingInvoice = false;
      return;
    }

    // Check if the invoice already exists
    const invoiceExists = await checkIfInvoiceExists(user.uid, course.courseId);
    if (invoiceExists) {
      console.warn("Invoice already exists for this course. Skipping generation.");
      setLoading(false);
      isGeneratingInvoice = false;
      return;
    }
    
    const invoiceElement = refs.current[`${user.uid}-${course.courseId}`];

    if (!invoiceElement) {
      console.error("Invoice element is not ready");
      isGeneratingInvoice = false;
      return;
    }

    const newInvoiceNumber = await generateInvoiceNumber();
    const formattedDate = formatDate(course.dateProcessed);

    // Set invoice number and date after ensuring the element is ready
    const invoiceNumberElement = document.getElementById(`invoiceNumber-${user.uid}-${course.courseId}`);
    const invoiceDateElement = document.getElementById(`invoiceDate-${user.uid}-${course.courseId}`);
    const paymentIdElement = document.getElementById(`paymentId-${user.uid}-${course.courseId}`);
    const orderIdElement = document.getElementById(`orderId-${user.uid}-${course.courseId}`);

    if (!invoiceNumberElement || !invoiceDateElement || !paymentIdElement || !orderIdElement) {
      console.error("Invoice elements for setting date/number/ID not found");
      isGeneratingInvoice = false;
      return;
    }

    invoiceNumberElement.innerText = `Invoice #: ${newInvoiceNumber}`;
    invoiceDateElement.innerText = `Date: ${formattedDate}`;
    paymentIdElement.innerText = `Payment Id: ${course.paymentId}`;
    orderIdElement.innerText = `Order Id: ${course.orderId}`;

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 2000)); // Increase delay to ensure rendering is complete

    if (invoiceElement.innerHTML.trim() === "") {
      console.error("Empty invoice content");
      isGeneratingInvoice = false;
      return;
    }

    // Generate PDF
    const opt = {
      margin: 0.5,
      filename: `${newInvoiceNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    const invoicePDF = await html2pdf().from(invoiceElement).set(opt).output('blob');

    // Upload PDF to Firebase Storage
    const storageRef = ref(learningstorage, `invoices/${user.uid}/${newInvoiceNumber}.pdf`);
    await uploadBytes(storageRef, invoicePDF);

    const pdfURL = await getDownloadURL(storageRef);

    // Save PDF URL to Firestore
    const docRef = doc(collection(learningFirestore, `invoices/${user.uid}/history`));
    await setDoc(docRef, {
      invoiceNumber: newInvoiceNumber,
      pdfUrl: pdfURL,
      courseId: course.courseId,
      paymentId: course.paymentId, // Ensure paymentId is saved
      orderId: course.orderId // Ensure orderId is saved
    });

    // Update last invoice number
    const lastInvoiceRef = doc(learningFirestore, 'invoiceNumbers', 'lastInvoice');
    await setDoc(lastInvoiceRef, { lastInvoiceNumber: newInvoiceNumber });

    console.log('Saved Invoice as PDF');

    // Set loading state to false
    setLoading(false);

  } catch (error) {
    console.error('Error generating or saving invoice:', error);
    setLoading(false);
  } finally {
    isGeneratingInvoice = false;
  }
};

const InvoiceTemplate = ({ userData, courseData, setLoading, refs }) => {
  useEffect(() => {
    if (userData && courseData && !isGeneratingInvoice) {
      generateAndSaveInvoice(userData, courseData, refs, setLoading);
    }
  }, [userData, courseData]);

  return (
    <div>
      {userData && courseData && (
        <div ref={el => (refs.current[`${userData.uid}-${courseData.courseId}`] = el)} style={styles.invoiceContainer}>
          <div style={styles.header}>
            <div style={styles.brand}>
              <div style={styles.brandName}>PulseZest-Learning</div>
            </div>
            <div style={styles.invoiceInfo}>
              <div style={styles.infoItem}>GST NO: 09ILJPK0660Q1ZC</div>
              <div style={styles.infoItem} id={`invoiceDate-${userData.uid}-${courseData.courseId}`}>Date: </div>
              <div style={styles.infoItem} id={`invoiceNumber-${userData.uid}-${courseData.courseId}`}>Invoice #: </div>
            </div>
          </div>

          <div style={styles.companyInfo}>
            <div style={styles.infoSection}>
              <div style={styles.sectionTitle}>PulseZest Learning</div>
              <div style={styles.infoItem}>Number: +91 6396219233</div>
              <div style={styles.infoItem}>Email: info@pulsezest.com</div>
              <div style={styles.infoItem}>GST IN: 09ILJPK0660Q1ZC</div>
              <div style={styles.infoItem}>Address: Pashupati Vihar Colony</div>
              <div style={styles.infoItem}>69/2, Ground Floor</div>
              <div style={styles.infoItem}>Bareilly, Uttar Pradesh</div>
              <div style={styles.infoItem}>Pin-243006</div>
            </div>

            <div style={styles.infoSection}>
              <div style={styles.sectionTitle}>Student Details</div>
              <div style={styles.infoItem}>Name: {userData.name}</div>
              <div style={styles.infoItem}>Email: {userData.email}</div>
              <div style={styles.infoItem}>SUID: {userData.suid}</div>
            </div>
          </div>

          <table style={styles.productTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>#</th>
                <th style={styles.tableHeader}>Product details</th>
                <th style={styles.tableHeader}>Amount (₹)</th>
                <th style={styles.tableHeader}>Qty.</th>
                <th style={styles.tableHeader}>Tax Amount (₹)</th>
                <th style={styles.tableHeader}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.tableContent}>1</td>
                <td style={styles.tableContent}>{courseData.name}</td>
                <td style={styles.tableContent}>{((courseData.amount * 0.82) / 100).toFixed(2)}</td>
                <td style={styles.tableContent}>1</td>
                <td style={styles.tableContent}>{((courseData.amount * 0.18) / 100).toFixed(2)}</td>
                <td style={styles.tableContent}>{(courseData.amount / 100).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div style={styles.totals}>
            <div style={styles.totalItem}>Net total (₹): {((courseData.amount * 0.82) / 100).toFixed(2)}</div>
            <div style={styles.totalItem}>GST (₹): {((courseData.amount * 0.18) / 100).toFixed(2)}</div>
            <div style={styles.totalItem}>Total (₹): {(courseData.amount / 100).toFixed(2)}</div>
          </div>
          <div style={styles.paymentDetails}>
            <div style={styles.sectionTitle}>PAYMENT DETAILS</div>
            <div style={styles.infoItem} id={`paymentId-${userData.uid}-${courseData.courseId}`}>Payment Id: N/A</div>
            <div style={styles.infoItem} id={`orderId-${userData.uid}-${courseData.courseId}`}>Order Id: N/A</div>
          </div>
          <h1 style={{ fontSize: '24px', margin: '0 0 0 auto', color: '#555', position: 'relative', left: '230px' }}>Love From ❤️ PulseZest</h1>

          <div style={styles.footer}>
            <div style={styles.footerItem}>PulseZest-Learning</div>
            <div style={styles.footerItem}>info@pulsezest.com</div>
            <div style={styles.footerItem}>+91 6396219233</div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  invoiceContainer: {
    fontFamily: 'Arial, sans-serif',
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #CCCCCC',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFFFFF',
    color: '#333333',
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    borderBottom: '1px solid #CCCCCC',
    paddingBottom: '10px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  brandName: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333333',
  },
  invoiceInfo: {
    textAlign: 'right',
    flex: '1',
  },
  infoItem: {
    marginBottom: '5px',
    color: '#666666',
  },
  companyInfo: {
    display: 'flex',
    justifyContent: 'space-evenly',
    marginBottom: '20px',
    backgroundColor: '#F7F7F7',
    padding: '20px',
    borderRadius: '8px',
  },
  infoSection: {
    flex: '1',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#0437F2',
  },
  productTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHeader: {
    backgroundColor: '#F7F7F7',
    padding: '10px',
    fontWeight: 'bold',
    color: '#0437F2',
    textAlign: 'left',
    borderBottom: '2px solid #CCCCCC',
  },
  tableContent: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #CCCCCC',
  },
  totals: {
    textAlign: 'right',
    marginTop: '20px',
    borderTop: '2px solid #CCCCCC',
    paddingTop: '10px',
  },
  totalItem: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  paymentDetails: {
    marginTop: '20px',
    padding: '20px',
    fontWeight: 'bold',
    color: '#0437F2',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
  },
  notes: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    borderTop: '2px solid #1C2833',
    paddingTop: '10px',
    backgroundColor: '#F7F7F7',
    borderRadius: '18px',
  },
  footerItem: {
    fontSize: '12px',
    color: '#0437F2',
  },
};

export default InvoiceTemplate;
export { generateAndSaveInvoice, generateInvoiceNumber, fetchLastInvoiceNumber, formatDate };