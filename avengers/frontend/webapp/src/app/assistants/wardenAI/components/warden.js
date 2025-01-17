"use client";

import React, { useState } from 'react';
import Markdown from 'react-markdown';

const Warden = () => {
  const [files, setFiles] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    // Merge new files with existing ones and remove duplicates
    // for some reason if only one of the given files is repeated, the code doesnt works as expected
    setFiles((prevFiles) => {
      const fileMap = new Map(prevFiles.map((file) => [file.name, file]));
      newFiles.forEach((file) => {
        if (!fileMap.has(file.name)) {  // Avoid duplicates
          fileMap.set(file.name, file);
        }
      });
      return Array.from(fileMap.values());
    });
  };

  const handleDownload = () => {
    // Create a Markdown string from the vulnerabilities
    let markdownContent = "# Vulnerability Report\n\n";

    responseData.data.forEach((vuln, index) => {
      markdownContent += `## ${index + 1}. ${vuln.title}\n\n`;
      markdownContent += `**File:** \`${vuln.file}\`\n\n`;
      markdownContent += `**Description:**\n${vuln.description}\n\n`;
      
      markdownContent += `**Lines Affected:**\n`;
      markdownContent += "```plaintext\n" + vuln.lines + "\n```\n\n";
      
      markdownContent += `**Fix:**\n`;
      markdownContent += "```plaintext\n" + vuln.fix + "\n```\n\n";
      
      markdownContent += "---\n\n";
    });

    // Create a Blob object for the data
    const blob = new Blob([markdownContent], { type: 'text/markdown' });

    // Get timestamp for the file name
    const currentDate = new Date();

    // Get day, month, year, hour, minute, and second
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const year = currentDate.getFullYear();
    const hour = String(currentDate.getHours()).padStart(2, '0');
    const minute = String(currentDate.getMinutes()).padStart(2, '0');
    const second = String(currentDate.getSeconds()).padStart(2, '0');

    // Combine them into a string in the desired format
    const timestamp = `${day}${month}${year}_${hour}${minute}${second}`;
    
    // Create a URL for the Blob and set it to a temporary link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vulnerabilities_report'+ timestamp +'.md'; // Markdown file name
    
    // Trigger the download and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file removal
  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (files.length === 0) return;

    setLoading(true);

    try {
      const contentsArray = await Promise.all(
        files.map(async (file) => {
          const content = await file.text();
          return {
            name: file.name,
            content: content
          };
        })
      );
      
      const xhr = new XMLHttpRequest();
      // xhr.open('POST', 'http://localhost:8080/online', true)
      xhr.open('POST', 'https://superhero-05-01-150699885662.europe-west1.run.app/online', true)
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function() {
        console.log(xhr.responseText);

        if (xhr.status === 200){
          let response = JSON.parse(xhr.responseText);
          setResponseData(response);
          setFiles([]);
        }
        else{
          console.error("Error uploading file:", xhr.statusText);
        }
      }

      xhr.onerror = function () {
        setResponseData({ "error": "Sorry, but we had a problem rendering vulnerabilities. Please try again later." });
      };

      xhr.send(JSON.stringify({files: contentsArray}));

    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
    
    };

  return (
    <div className="bg-light container-fluid min-vh-100 text-dark">
      <div className="d-flex justify-content-center align-items-center">
        <h1 className='text-center text-primary display-4 p-4' style={{ minHeight: '20vh' }}>
          WardenAI
        </h1>
        <br />
      </div>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      {responseData == null ? (
        <div className="card shadow-lg p-4 bg-light" style={{ maxWidth: '500px', width: '100%' }}>
          <h1 className="text-primary mb-4">Upload Your File</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label">Choose a file:</label>
              <input
                id="fileInput"
                type="file"
                className="form-control bg-light"
                onChange={handleFileChange}
                multiple
              />
            </div>
            {files.length > 0 && (
              <div className="mb-3">
                <h5>Selected Files:</h5>
                <ul className="list-groupt">
                  {files.map((file) => (
                    <li key={file.name} className="list-group-item bg-light d-flex justify-content-between align-items-center">
                      {file.name}
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => handleRemoveFile(file.name)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-center mt-4">
              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={files.length === 0 || loading}
                  className="btn btn-primary btn-lg w-100"
                >
                  Upload File
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        responseData.error ? (
          <div className="alert alert-danger" role="alert">
            {responseData.error}
          </div>
        ) : (
          <div className="container p-4 m-4">
            <button 
              className="btn btn-success mb-4" 
              onClick={handleDownload}
            >
              Download Vulnerability Report
            </button>
            {responseData.data.map((vulnerability) => (
              <div key={vulnerability.title} className="card mb-4 p-3 bg-light shadow-sm">
                <h2 className="text-success">{vulnerability.title}</h2>
                <p className="text-muted small mb-2">
                  <strong>File:</strong> {vulnerability.file}
                </p>
                <Markdown>{vulnerability.description}</Markdown>
                <div>
                  <h5 className="mt-3">Lines:</h5>
                  <Markdown className="bg-light p-2 rounded border">
                    {"```" + vulnerability.lines + "```"}
                  </Markdown>
                </div>
                <h5 className="mt-3">Fix:</h5>
                <Markdown className="bg-light p-2 rounded border">
                  {vulnerability.fix}
                </Markdown>
              </div>
            ))}
          </div>
        )
      )}
      </div>
    </div>
  );
  
};  

export default Warden;
