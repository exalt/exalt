/* development options */
export const developmentOptions = {
    library: false,
    target: "es2015",
    minify: false,
    sourcemap: false,
    define: {},
    paths: {},
    devServer: {
        open: true,
        port: 3000,
        headers: {}
    }
};

/* production options */
export const productionOptions = {
    library: false,
    target: "es2015",
    minify: true,
    sourcemap: false,
    define: {},
    paths: {},
    devServer: {
        open: false,
        port: 3000,
        headers: {}
    }
};