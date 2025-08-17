// Test script for Survey API
console.log('Testing Survey API endpoints...');

const baseUrl = 'http://localhost:5000/api';

// Test 1: Create sample survey
async function createSampleSurvey() {
  try {
    const response = await fetch(`${baseUrl}/surveys/sample/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('✅ Sample survey created:', result);
    return result.survey.id;
  } catch (error) {
    console.error('❌ Error creating sample survey:', error);
    return null;
  }
}

// Test 2: Get all surveys
async function getAllSurveys() {
  try {
    const response = await fetch(`${baseUrl}/surveys`);
    const surveys = await response.json();
    console.log('✅ All surveys:', surveys);
    return surveys;
  } catch (error) {
    console.error('❌ Error getting surveys:', error);
    return [];
  }
}

// Test 3: Get specific survey with questions
async function getSurveyWithQuestions(surveyId) {
  try {
    const response = await fetch(`${baseUrl}/surveys/${surveyId}`);
    const survey = await response.json();
    console.log('✅ Survey with questions:', survey);
    return survey;
  } catch (error) {
    console.error('❌ Error getting survey:', error);
    return null;
  }
}

// Test 4: Submit survey response
async function submitSurveyResponse(surveyId, questions) {
  try {
    const responses = [
      { questionId: questions[0].id, answer: "John Doe" },
      { questionId: questions[1].id, answer: "john.doe@example.com" },
      { questionId: questions[2].id, answer: "30" },
      { questionId: questions[3].id, answer: "Employed full-time" },
      { questionId: questions[4].id, answer: "$75,000 - $99,999" },
      { questionId: questions[5].id, answer: "None of the above" },
      { questionId: questions[6].id, answer: "I'm concerned about the cost of long-term care and want to plan ahead." }
    ];

    const response = await fetch(`${baseUrl}/surveys/${surveyId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ responses })
    });
    
    const result = await response.json();
    console.log('✅ Survey response submitted:', result);
    return result;
  } catch (error) {
    console.error('❌ Error submitting survey:', error);
    return null;
  }
}

// Test 5: Get survey submission
async function getSurveySubmission(sessionId) {
  try {
    const response = await fetch(`${baseUrl}/submissions/${sessionId}`);
    const submission = await response.json();
    console.log('✅ Survey submission:', submission);
    return submission;
  } catch (error) {
    console.error('❌ Error getting submission:', error);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Survey API tests...\n');
  
  // Test 1: Create sample survey
  console.log('1. Creating sample survey...');
  const surveyId = await createSampleSurvey();
  if (!surveyId) return;
  
  console.log('\n2. Getting all surveys...');
  await getAllSurveys();
  
  console.log('\n3. Getting survey with questions...');
  const survey = await getSurveyWithQuestions(surveyId);
  if (!survey || !survey.questions) return;
  
  console.log('\n4. Submitting survey response...');
  const submission = await submitSurveyResponse(surveyId, survey.questions);
  if (!submission) return;
  
  console.log('\n5. Getting survey submission...');
  await getSurveySubmission(submission.sessionId);
  
  console.log('\n🎉 All tests completed successfully!');
}

// Export for use in browser console or Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  window.runSurveyTests = runTests;
  console.log('Run "runSurveyTests()" in the console to test the API');
} else {
  // Node.js environment (if running with node-fetch)
  runTests();
}
