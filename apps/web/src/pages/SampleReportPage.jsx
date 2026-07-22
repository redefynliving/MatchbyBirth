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
        <meta name="description" content="Preview a full Match by Birth paid report before checkout, including calculated evidence, nine practical sections, scripts, and a seven-day plan." />
        <link rel="canonical" href="https://matchbybirth.com/sample-report" />
        <meta property="og:title" content="Sample Compatibility Report | Match by Birth" />
        <meta property="og:description" content="Preview a full Match by Birth paid report before checkout, including calculated evidence, nine practical sections, scripts, and a seven-day plan." />
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
