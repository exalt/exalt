import rollup from "rollup";
import getRollupConfig from "./configs/rollup";

export default async function build(options) {
    const config = getRollupConfig(options);

    try {
        const bundle = await rollup.rollup({ input: config.input, plugins: config.plugins });
        await bundle.write(config.output);
        console.log(`Successfully built ${options.name}`);
    } catch (error) {
        console.error(`\nExalt StackTrace: ${error.message}`);
        if (error.loc) {
            console.error(`File: ${error.id}`);
            console.error(`Line: ${error.loc.line}, Column: ${error.loc.column}`);
            if (error.frame) { console.error(error.frame); }
        }
    }
}