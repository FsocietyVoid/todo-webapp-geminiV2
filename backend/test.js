const testAPI = async () => {
    const response = await fetch('http://localhost:5000/api/ai/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Plan a birthday party' })
    });
    const data = await response.json();
    console.log('Response:', data);
};

testAPI();