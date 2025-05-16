import React, { Component } from 'react';

class CodeEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: props.code || ''
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.code !== this.props.code) {
            this.setState({ code: this.props.code });
        }
    }

    handleChange = (event) => {
        const newCode = event.target.value;
        // Only update local state if not controlled by parent
        if (this.props.code === undefined) {
            this.setState({ code: newCode });
        }
        if (this.props.onCodeChange) {
            this.props.onCodeChange(newCode);
        }
    };

    handleCompile = () => {
        // Use prop code if controlled, else local state
        const codeToCompile = this.props.code !== undefined ? this.props.code : this.state.code;
        if (this.props.onCompile) {
            this.props.onCompile(codeToCompile, this.props.language || 'javascript');
        }
    };

    render() {
        const { output, language = 'javascript', onLanguageChange } = this.props;
        // Show a more user-friendly error for C++ fetch failures
        let displayOutput = output;
        if (output && typeof output === 'string' && output.trim() === 'C++ Compilation error: Failed to fetch') {
            displayOutput = 'C++ Compilation error: Unable to connect to the online compiler service. Please check your internet connection or API credentials.';
        }
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', gap: '2rem', alignItems: 'stretch', justifyContent: 'center', minHeight: '60vh', padding: '2rem' }}>
                <div style={{ flex: '1 1 400px', maxWidth: 600, minWidth: 320, display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1rem' }}>
                    <h2 style={{ marginBottom: '0.5rem', padding: '1rem 1rem 0 1rem' }}>Code Editor</h2>
                    <div style={{ marginBottom: '1rem', textAlign: 'left', padding: '0 1rem' }}>
                        <label htmlFor="language-select" style={{ fontWeight: 600, marginRight: 8 }}>Language:</label>
                        <select
                            id="language-select"
                            value={language}
                            onChange={e => onLanguageChange && onLanguageChange(e.target.value)}
                            style={{ padding: '0.3rem 1rem', fontSize: '1rem', borderRadius: 6, border: '1px solid #ccc', background: '#f9f9f9', fontFamily: 'inherit' }}
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python" disabled>Python (coming soon)</option>
                            <option value="cpp">C++</option>
                        </select>
                    </div>
                    <textarea
                        value={this.props.code !== undefined ? this.props.code : this.state.code}
                        onChange={this.handleChange}
                        rows={18}
                        cols={60}
                        placeholder="Write your code here..."
                        style={{ width: '100%', minHeight: '300px', fontFamily: 'monospace', fontSize: '1rem', borderRadius: 8, border: '1px solid #ccc', padding: '1rem', boxSizing: 'border-box', background: '#f9f9f9', resize: 'vertical' }}
                    />
                    <div style={{ margin: '1rem', textAlign: 'right' }}>
                        <button type="button" onClick={this.handleCompile} style={{ padding: '0.5rem 1.5rem', fontSize: '1rem', borderRadius: 6, background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                            Compile
                        </button>
                    </div>
                </div>
                {/* Output Window */}
                <div style={{ flex: '1 1 400px', maxWidth: 600, minWidth: 320, background: '#222', color: '#fff', borderRadius: 8, minHeight: '300px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.10)', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ color: '#90ee90', marginBottom: '0.5rem' }}>Output</h2>
                    <pre style={{ flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '1.1rem', fontFamily: 'Fira Mono, monospace', margin: 0, background: 'none' }}>{displayOutput}</pre>
                </div>
            </div>
        );
    }
}

export default CodeEditor;