/* default options */
export const defaultOptions = {
    library: false,
    target: "es2015",
    minify: (process.env.NODE_ENV == "production") ? true : false,
    sourcemap: false,
    paths: null,
    publicPath: "/",
    open: (process.env.NODE_ENV == "development") ? true : false,
    port: 3000,
    headers: {}
};