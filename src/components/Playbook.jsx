import React from 'react';
import PlayCard from './PlayCard';

function Playbook({ savedPlays, onDeletePlay, isLoading, syncStatus }) {
  const handlePrintAll = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Check if jsPDF is available
    if (typeof window.jsPDF === 'undefined') {
      alert('PDF export is not available. Please check your internet connection.');
      return;
    }

    const { jsPDF } = window.jsPDF;
    const pdf = new jsPDF();
    
    // Add title page
    pdf.setFontSize(24);
    pdf.text('Flag Football Playbook', 20, 30);
    pdf.setFontSize(12);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 45);
    pdf.text(`Total Plays: ${savedPlays.length}`, 20, 55);
    
    // Add each play (simplified version for PDF)
    savedPlays.forEach((play, index) => {
      if (index > 0) {
        pdf.addPage();
      } else {
        pdf.text('', 20, 80); // Add some space after title
      }
      
      // Play title
      pdf.setFontSize(18);
      pdf.text(play.name, 20, 90);
      
      // Play details
      pdf.setFontSize(12);
      let yPos = 110;
      
      if (play.description) {
        pdf.text(`Description: ${play.description}`, 20, yPos);
        yPos += 15;
      }
      
      pdf.text(`Category: ${play.category}`, 20, yPos);
      yPos += 20;
      
      if (play.vsMan) {
        pdf.text('vs. Man Defense:', 20, yPos);
        yPos += 10;
        const manLines = pdf.splitTextToSize(play.vsMan, 170);
        pdf.text(manLines, 20, yPos);
        yPos += manLines.length * 5 + 10;
      }
      
      if (play.vsZone) {
        pdf.text('vs. Zone Defense:', 20, yPos);
        yPos += 10;
        const zoneLines = pdf.splitTextToSize(play.vsZone, 170);
        pdf.text(zoneLines, 20, yPos);
      }
    });
    
    pdf.save('flag-football-playbook.pdf');
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Loading your playbook...</h3>
        <p className="text-gray-500">Syncing with cloud storage</p>
      </div>
    );
  }

  if (savedPlays.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No plays saved yet</h3>
        <p className="text-gray-500">Create your first play using the designer above.</p>
        {syncStatus === 'offline' && (
          <p className="text-yellow-600 text-sm mt-2">
            Currently in offline mode. Plays will sync when connection is restored.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <button
          onClick={handlePrintAll}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Playbook
        </button>
        
        <button
          onClick={handleExportPDF}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Play Count */}
      <div className="text-sm text-gray-600 print:hidden">
        {savedPlays.length} play{savedPlays.length !== 1 ? 's' : ''} in your playbook
      </div>

      {/* Plays Grid */}
      <div className="grid grid-cols-1 gap-6">
        {savedPlays.map((play) => (
          <PlayCard
            key={play.id}
            playData={play}
            onDelete={onDeletePlay}
          />
        ))}
      </div>
    </div>
  );
}

export default Playbook;
