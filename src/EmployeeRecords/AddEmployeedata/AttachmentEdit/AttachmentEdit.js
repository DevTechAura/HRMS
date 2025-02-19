import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';

const AttachmentEdit = ({ isOpen, onClose, employeeId }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (employeeId && isOpen) {
            // Fetch the PDF document when the popup is open
            fetch(`/api/employee/${employeeId}/degreeCertificate`)
                .then((response) => {
                    if (!response.ok) throw new Error('Network response was not ok');
                    return response.blob(); // Get the response as a Blob
                })
                .then((blob) => {
                    const url = URL.createObjectURL(blob); // Create a URL for the Blob
                    console.log('PDF URL:', url); // Log the PDF URL for debugging
                    setPdfUrl(url); // Set the URL to the state
                })
                .catch((error) => {
                    console.error('Error fetching the document:', error);
                    setPdfUrl(null);
                });
        } else {
            // Clean up PDF URL when modal is closed
            setPdfUrl(null);
        }

        // Cleanup function to revoke object URL
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [employeeId, isOpen]);

    const handleOverlayClick = (e) => {
        // Close the modal if the overlay is clicked
        if (e.target.className.includes('modal')) {
            onClose();
        }
    };

    const handleCloseClick = () => {
        onClose(); // Close the modal without any notification
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
            <div className="modal-content">
                <span className="close" onClick={handleCloseClick}>&times;</span>
                <h2>View the Attached File</h2>
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        style={{ width: '100%', height: '400px' }}
                        title="Degree Certificate"
                    />
                ) : (
                    <p>No file attached or error loading the file</p>
                )}
                <button onClick={handleCloseClick}>Close</button>
            </div>
        </div>
    );
};

export default AttachmentEdit;
