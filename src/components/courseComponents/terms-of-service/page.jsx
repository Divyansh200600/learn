
const PdfViewer = () => {
  return (
    <div>
        <div className="text-lg text-gray-700">
          {/* Placeholder for other content */}
        </div>
        <div className="mt-2">
          <iframe
            src={"https://firebasestorage.googleapis.com/v0/b/pulsezest.appspot.com/o/PulseZest-Course-Agreement%2FPulsezest%20Agreement%20(1).pdf?alt=media&token=06caddff-f0d2-46f2-b1f7-b45985215ab4"}
            width="100%"
            height="445px"
            
          />
        </div>
      </div>
  );
};

export default PdfViewer;
