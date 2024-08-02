import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Lang = () => {
    const [isTornado, setIsTornado] = useState(false);
    const [selectedLang, setSelectedLang] = useState(null);

    const scrollToCodeBox = () => {
        document.querySelector('#codeBox').scrollIntoView({ behavior: 'smooth' });
        window.location.href = '/course/Jaf27ItydQgHxkTlNJRO'; // Replace with your desired URL

    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#f7f9fc',
        minHeight: '100vh',
        padding: '20px',
        width: '1349px',
        position: 'relative',
    };

    const headingStyle = {
        fontSize: '46px',
        fontWeight: 'bold',
        background: 'linear-gradient(to right, #ff6f61, #de1b24)',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        marginBottom: '20px',
        textAlign: 'center',
    };

    const buttonStyle = {
        marginTop: '20px',
        padding: '15px 30px',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', // Gradient background
        color: '#fff',
        border: 'none',
        borderRadius: '50px', // More rounded corners
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '600', // Slightly bolder text
        textTransform: 'uppercase', // Uppercase text
        transition: 'all 0.3s ease', // Smooth transition for all properties
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Enhanced shadow for a floating effect
        outline: 'none', // Remove default focus outline
        transform: 'scale(1)', // Default scale
    };

    const buttonHoverStyle = {
        background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)', // Gradient inversion on hover
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)', // Deeper shadow on hover
        transform: 'scale(1.05)', // Slightly scale up on hover
    };

    const buttonActiveStyle = {
        background: 'linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)', // Consistent gradient on active
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow adjustment on active
        transform: 'scale(0.95)', // Scale down slightly on click
    };


    const tornadoContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%',
        position: 'relative',
        height: '80vh',
        overflow: 'hidden',
    };

    const iconContainerStyle = {
        display: 'inline-block',
        position: 'relative',
        margin: '15px',
        width: '100px',
        height: '100px',
    };

    const iconStyle = {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, background-color 0.3s',
        position: 'relative',
        zIndex: 2,
    };

    const tooltipStyle = {
        visibility: 'hidden',
        backgroundColor: '#333',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '5px',
        padding: '10px',
        position: 'absolute',
        top: '110%',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: 0,
        transition: 'opacity 0.3s, visibility 0.3s',
        whiteSpace: 'nowrap',
        zIndex: 3,
    };

    const iconContainerHoverStyle = {
        backgroundColor: '#e0e0e0',
        transform: 'translateY(-5px)',
    };

    const tornadoEffect = `
        @keyframes tornado {
            0% { transform: rotate(0deg) translateY(0); }
            100% { transform: rotate(360deg) translateY(-300px); }
        }
        .tornado-icon {
            animation: tornado 5s linear infinite;
        }
        .icon-container:hover .tooltip {
            visibility: visible;
            opacity: 1;
        }
    `;

    const codeBoxStyle = {
        position: 'relative',
        top: '-10px',
        width: '80%',
        maxWidth: '800px',
        padding: '20px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        marginTop: '20px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s',
    };

    const codeBoxHoverStyle = {
        transform: 'translateY(-5px)',
    };

    const languageCode = {
        Java: `// Android Activity\npublic class MainActivity extends AppCompatActivity {\n  @Override\n  protected void onCreate(Bundle savedInstanceState) {\n    super.onCreate(savedInstanceState);\n    setContentView(R.layout.activity_main);\n  }\n}`,
        Kotlin: `// Kotlin Android Activity\nclass MainActivity : AppCompatActivity() {\n  override fun onCreate(savedInstanceState: Bundle?) {\n    super.onCreate(savedInstanceState)\n    setContentView(R.layout.activity_main)\n  }\n}`,
        XML: `<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"\n    android:layout_width="match_parent"\n    android:layout_height="match_parent"\n    android:orientation="vertical">\n    <TextView\n        android:layout_width="wrap_content"\n        android:layout_height="wrap_content"\n        android:text="Hello World!" />\n</LinearLayout>`,
        Retrofit: `// Retrofit Interface\ninterface ApiService {\n    @GET("users/{user}/repos")\n    suspend fun listRepos(@Path("user") user: String): List<Repo>\n}`,
        Firebase: `// Firebase Authentication\nFirebaseAuth.getInstance().signInWithEmailAndPassword(email, password)\n    .addOnCompleteListener(this) { task ->\n        if (task.isSuccessful) {\n            // Sign in success\n        } else {\n            // If sign in fails\n        }\n    }`,
        Room: `@Entity\ndata class User(\n    @PrimaryKey val uid: Int,\n    @ColumnInfo(name = "first_name") val firstName: String?,\n    @ColumnInfo(name = "last_name") val lastName: String?\n)`,
        Flutter: `// Flutter Widget\nimport 'package:flutter/material.dart';\n\nvoid main() => runApp(MaterialApp(\n  home: Scaffold(\n    body: Center(child: Text('Hello World!')),\n  ),\n));`,
        Dart: `// Dart Example\nvoid main() {\n  print('Hello, Dart!');\n}\n`,
    };
    
    const getLangClass = (lang) => {
        switch (lang) {
            case 'Java':
                return 'java';
            case 'Kotlin':
                return 'kotlin';
            case 'XML':
                return 'xml';
            case 'Flutter':
                return 'dart';
            case 'Retrofit':
                return 'kotlin';
            case 'Dart':
                return 'dart';
            case 'Firebase':
                return 'java';
            case 'Room':
                return 'kotlin';
            default:
                return 'text';
        }
    };
    


    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Explore Languages</h1>
            <div style={tornadoContainerStyle}>
                {[
                    { src: 'https://img.icons8.com/color/96/000000/flutter.png', alt: 'Flutter', key: 'Flutter', tooltip: 'Flutter is an open-source UI software development toolkit created by Google.' },
                    { src: 'https://img.icons8.com/color/96/000000/dart.png', alt: 'Dart', key: 'Dart', tooltip: 'Dart is a programming language optimized for building mobile, desktop, and server applications.' },
                    { src: 'https://img.icons8.com/color/96/000000/java-coffee-cup-logo.png', alt: 'Java', key: 'Java', tooltip: 'Java is a primary language for Android development.' },
                    { src: 'https://img.icons8.com/color/96/000000/kotlin.png', alt: 'Kotlin', key: 'Kotlin', tooltip: 'Kotlin is a modern, expressive language for Android development.' },
                    { src: 'https://img.icons8.com/color/96/000000/xml-file.png', alt: 'XML', key: 'XML', tooltip: 'XML is used for designing Android UI layouts.' },
                    { src: 'https://img.icons8.com/color/96/000000/api.png', alt: 'Retrofit', key: 'Retrofit', tooltip: 'Retrofit is used for networking in Android applications.' },
                    { src: 'https://img.icons8.com/color/96/000000/firebase.png', alt: 'Firebase', key: 'Firebase', tooltip: 'Firebase provides backend services for Android applications.' },
                    { src: 'https://img.icons8.com/color/96/000000/database.png', alt: 'Room', key: 'Room', tooltip: 'Room is a persistence library for Android applications.' }
                ].map((icon, index) => (
                    <div
                        key={index}
                        style={iconContainerStyle}
                        className={`icon-container ${isTornado ? 'tornado-icon' : ''}`}
                        onMouseOver={() => setSelectedLang(icon.key)}
                        onMouseOut={() => setSelectedLang(null)}
                    >
                        <div
                            style={iconStyle}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = iconContainerHoverStyle.backgroundColor;
                                e.currentTarget.style.transform = iconContainerHoverStyle.transform;
                                e.currentTarget.querySelector('img').style.opacity = 0.8;
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '';
                                e.currentTarget.style.transform = '';
                                e.currentTarget.querySelector('img').style.opacity = 1;
                            }}
                        >
                            <img src={icon.src} alt={icon.alt} style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div style={tooltipStyle} className="tooltip">
                            {icon.tooltip}
                        </div>
                    </div>
                ))}
                <div
                    id="codeBox"
                    style={codeBoxStyle}
                    onMouseOver={(e) => e.currentTarget.style.transform = codeBoxHoverStyle.transform}
                    onMouseOut={(e) => e.currentTarget.style.transform = ''}
                >
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        display: 'flex',
                        gap: '8px',
                        zIndex: 1,
                    }}>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#ff605c',
                        }}></div>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#ffbd44',
                        }}></div>
                        <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#00ca56',
                        }}></div>
                    </div>
                    {selectedLang ? (
                        <SyntaxHighlighter
                            language={getLangClass(selectedLang)}
                            style={solarizedlight}
                        >
                            {languageCode[selectedLang]}
                        </SyntaxHighlighter>
                    ) : (
                        'Hover over an icon to see the code.'
                    )}
                </div>
            </div>
            <style jsx>{tornadoEffect}</style>
            <button
                style={buttonStyle}
                onMouseOver={(e) => {
                    Object.assign(e.currentTarget.style, buttonHoverStyle);
                }}
                onMouseOut={(e) => {
                    Object.assign(e.currentTarget.style, buttonStyle);
                }}
                onMouseDown={(e) => {
                    Object.assign(e.currentTarget.style, buttonActiveStyle);
                }}
                onMouseUp={(e) => {
                    Object.assign(e.currentTarget.style, buttonHoverStyle);
                }}
                onClick={scrollToCodeBox}
            >
                Explore
            </button>

        </div>
    );
};

export default Lang;
