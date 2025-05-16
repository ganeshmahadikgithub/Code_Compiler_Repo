import React, { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import compileCode from './utils/compiler';

async function compileCppFreeApi(code) {
    // Use the Piston API (https://emkc.org/api/v2/piston) for free C++ compilation
    try {
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: 'cpp',
                version: '10.2.0', // required by Piston API
                files: [{ name: 'main.cpp', content: code }]
            })
        });
        const data = await response.json();
        if (data.output) return data.output;
        if (data.run && data.run.output) return data.run.output;
        if (data.message) return data.message;
        return 'No output';
    } catch (err) {
        return 'C++ Compilation error: ' + err.message;
    }
}

const App = () => {
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [isCompiling, setIsCompiling] = useState(false);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setOutput('');
    };

    const handleCompile = async (codeToCompile, lang) => {
        setIsCompiling(true);
        if (lang === 'javascript') {
            const result = compileCode(codeToCompile);
            if (result.success) {
                setOutput(String(result.output));
            } else {
                setOutput('Error: ' + result.error);
            }
        } else if (lang === 'cpp') {
            setOutput('Compiling C++ code...');
            try {
                const cppOutput = await compileCppFreeApi(codeToCompile);
                setOutput(cppOutput);
            } catch (err) {
                setOutput('C++ Compilation error: ' + err.message);
            }
        } else {
            setOutput('This language is not supported yet.');
        }
        setIsCompiling(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f0f4f8 0%, #e0eafc 100%)' }}>
            <h1 style={{ textAlign: 'center', color: '#007bff', margin: 0, padding: '2rem 0 1rem 0', fontWeight: 800, letterSpacing: 1 }}>Code Compiler</h1>
            <CodeEditor
                code={code}
                onCodeChange={handleCodeChange}
                onCompile={handleCompile}
                output={isCompiling ? 'Compiling...' : output}
                language={language}
                onLanguageChange={handleLanguageChange}
            />
            <footer style={{ textAlign: 'center', marginTop: '2rem', color: '#888', fontSize: '0.95rem' }}>
                &copy; {new Date().getFullYear()} Code Compiler. All rights reserved.
            </footer>
        </div>
    );
};

export default App;