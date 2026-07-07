import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import ReportView from '@/components/report/ReportView.jsx';
import sampleReport from '@/data/sampleReport.js';

function SampleReportPage() {
  const reportRef = useRef(null);

  return (
    <>
      <Helmet>
        <title>Sample Compatibility Report | Match by Birth</title>
        <meta name="description" content="Preview a Match by Birth paid compatibility report before checkout, including strengths, friction, communication, watch area, and one practical conversation prompt." />
        <link rel="canonical" href="https://matchbybirth.com/sample-report" />
        <meta property="og:title" content="Sample Compatibility Report | Match by Birth" />
        <meta property="og:description" content="Preview a Match by Birth paid compatibility report before checkout, including strengths, friction, communication, watch area, and one practical conversation prompt." />
        <meta property="og:url" content="https://matchbybirth.com/sample-report" />
      </Helmet>

      <ReportView
        report={sampleReport.report}
        result={sampleReport.result}
        reportRef={reportRef}
        isPrivate={false}
        showDownload={false}
        mode="sample"
        backLabel="Back to Home"
        fallbackTo="/"
      />
    </>
  );
}

export default SampleReportPage;
