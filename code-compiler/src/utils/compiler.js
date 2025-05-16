function compileCode(code) {
    try {
        // Using the Function constructor to compile the code
        // eslint-disable-next-line no-new-func
        const compiledFunction = new Function(code);
        return {
            success: true,
            output: compiledFunction()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

export default compileCode;