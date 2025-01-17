import React, { useState } from 'react';

const Table = () => {
  const subjects = [
    { name: "Probability and Statistics", credits: 4 },
    { name: "Data Structures and Algorithms", credits: 4 },
    { name: "Science and Technical Writing", credits: 2 },
    { name: "IND 4.0", credits: 2 },
    { name: "Digital System Design", credits: 3 },
    { name: "AFL", credits: 4 },
    { name: "DSD Lab", credits: 1, isLab: true }, // New row
    { name: "Data Structures Lab", credits: 1, isLab: true }, // New row
  ];


  const [marks, setMarks] = useState(
    subjects.map((subject) => ({
      internal: subject.isLab ? undefined : "",
      endSem: subject.isLab ? undefined : "",
      total: subject.isLab ? "" : 0,
    }))
  );

  const [sgpa, setSgpa] = useState(null);

  const handleChange = (index, type, value) => {
    const newMarks = [...marks];
    if (subjects[index].isLab) {
      // Single input for lab rows, clamp to max 100
      newMarks[index].total = value === "" ? "" : Math.min(parseInt(value), 100);
    } else {
      // Separate inputs for internal and external marks, clamp to max 50
      newMarks[index][type] = value === "" ? "" : Math.min(parseInt(value), 50);
      newMarks[index].total =
        (parseInt(newMarks[index].internal) || 0) +
        (parseInt(newMarks[index].endSem) || 0);
    }
    setMarks(newMarks);
  };

  const calculateSGPA = () => {
    let totalWeightedScore = 0;
    let totalCredits = 0;
  
    subjects.forEach((subject, index) => {
      const totalMarks = marks[index].total;
      
      // Adjust grade point based on totalMarks
      let gradePoint = 0;
      if (totalMarks >= 90) {
        gradePoint = 10;
      } else if (totalMarks >= 80) {
        gradePoint = 9;
      } else if (totalMarks >= 70) {
        gradePoint = 8;
      } else if (totalMarks >= 60) {
        gradePoint = 7;
      } else if (totalMarks >= 50) {
        gradePoint = 6;
      } else if (totalMarks >= 40) {
        gradePoint = 5;
      } else {
        gradePoint = 0; // Assuming fail grades get 0
      }
  
      // Logging for debugging
      console.log(`Subject: ${subject.name}, Marks: ${totalMarks}, Grade Point: ${gradePoint}, Credits: ${subject.credits}`);
  
      // Calculate total weighted score and total credits
      totalWeightedScore += gradePoint * subject.credits;
      totalCredits += subject.credits;
    });
  
    // Calculate SGPA and set it
    const sgpa = totalWeightedScore / totalCredits;
    console.log(`Total Weighted Score: ${totalWeightedScore}, Total Credits: ${totalCredits}`);
    setSgpa(sgpa.toFixed(2));
  };
  
  return (
    <div className="container">
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Credits</th>
            <th>Internal (50)</th>
            <th>End Sem Exam (50)</th>
            <th>Total (100)</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <td>{subject.name}</td>
              <td>{subject.credits}</td>
              {subject.isLab ? (
                <>
                  <td colSpan="2">
                    <input
                      type="number"
                      max="100"
                      value={marks[index].total}
                      onChange={(e) => handleChange(index, "total", e.target.value)}
                    />
                  </td>
                  <td>{marks[index].total}</td>
                </>
              ) : (
                <>
                  <td>
                    <input
                      type="number"
                      max="50"
                      value={marks[index].internal}
                      onChange={(e) => handleChange(index, "internal", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      max="50"
                      value={marks[index].endSem}
                      onChange={(e) => handleChange(index, "endSem", e.target.value)}
                    />
                  </td>
                  <td>{marks[index].total}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="action-container">
        <button className="calculate-button" onClick={calculateSGPA}>
          Calculate SGPA
        </button>
        {sgpa && <h3 className="sgpa-result">Your SGPA: {sgpa}</h3>}
      </div>
    </div>
  );
};

export default Table;