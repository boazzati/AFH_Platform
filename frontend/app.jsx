const startAnalysis = async () => {
  setIsAnalyzing(true)
  setAnalysisProgress(0)
  setAnalysisResult(null)

  // Progress simulation
  const progressInterval = setInterval(() => {
    setAnalysisProgress(prev => {
      if (prev >= 90) return 90;
      return prev + Math.random() * 10;
    });
  }, 500);

  try {
    // Prepare request data
    const requestData = {
      brand_a: scenarioData.brandA,
      brand_b: scenarioData.brandB,
      partnership_type: scenarioData.partnershipType,
      target_audience: scenarioData.targetAudience || 'Not specified',
      budget_range: scenarioData.budget || 'Not specified'
    };

    console.log('🚀 Starting analysis with data:', requestData);

    // Use the Railway backend URL
    const API_BASE = import.meta.env.VITE_API_URL || 'https://afhplatform-production.up.railway.app';
    const response = await fetch(`${API_BASE}/api/proxy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    clearInterval(progressInterval);
    setAnalysisProgress(100);

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Analysis result:', result);
    setAnalysisResult(result);

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    clearInterval(progressInterval);
    setAnalysisProgress(100);
    
    // Provide fallback analysis
    setAnalysisResult({
      error: 'API temporarily unavailable',
      service_used: 'fallback',
      analysis: {
        brand_alignment_score: Math.floor(Math.random() * 30) + 70,
        audience_overlap_percentage: Math.floor(Math.random() * 40) + 60,
        roi_projection: Math.floor(Math.random() * 100) + 150,
        risk_level: 'Medium',
        key_risks: ['Service temporarily unavailable', 'Using demo data'],
        recommendations: [
          `Partnership between ${scenarioData.brandA} and ${scenarioData.brandB} shows potential`,
          'Please try again when service is restored'
        ],
        market_insights: ['Analysis based on fallback data due to service issue']
      }
    });
  }
}
