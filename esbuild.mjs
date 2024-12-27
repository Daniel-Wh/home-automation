import { copy } from 'esbuild-plugin-copy';
import { build } from 'esbuild';
import fs from 'fs'
import archiver from 'archiver'

build({
    entryPoints: ['./app/lambda.ts'],
    bundle: true,
    platform: 'node',
    target: 'node22.0',
    minify: true,
    sourcemap: true,
    // as resolveFrom not set, we use dist as output base dir
    outdir: './dist',
    plugins: [
        copy({
            assets: [
                {
                    from: ['./node_modules/prisma/engines/5dbef10bdbfb579e07d35cc85fb1518d357cb99e/*rhel*'],
                    to: ['./'],
                },
                {
                    from: ['./prisma/*'],
                    to: ['./']
                }
            ],
        }),
    ],
}).then((r) => {
    console.log('build succeeded');
    const output = fs.createWriteStream('dist/build.zip')
    const archive = archiver('zip', {
        zlib: { level: 9 }
    })

    output.on('close', () => {
        console.log(archive.pointer() + ' total bytes')
    })

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    archive.directory('dist', false);

    archive.finalize();


}).catch(() => process.exit(1))
