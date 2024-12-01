import *    as fs from 'fs-extra';
import path from 'path';
import util from 'util';

const readdir = util.promisify(fs.readdir);
const rename = util.promisify(fs.rename);
const mkdir = util.promisify(fs.mkdir);
const stat = util.promisify(fs.stat);

// Source and destination directories
const projectDir: string = path.join(__dirname, '..');
const parentDir: string = path.join(projectDir, 'build');
console.log(parentDir);
// List of folders to exclude
const excludeDirs: string[] = ['source', 'node_modules', '.git', 'content', 'move-files.ts', 'package-lock.json', 'build', 'client', '.vs'];

const shouldMoveItem = (item: string): boolean => {
    // const itemPath = path.join(projectDir, item);
    const destPath = path.join(parentDir, item);


    if (excludeDirs.includes(item) || fs.existsSync(destPath)) {
        return false;
    }
    return true;
};

async function moveFiles(): Promise<void> {
    try {
        // Read the contents of the project directory
        const items: string[] = await readdir(projectDir);

        // Iterate over each item in the project directory
        for (const item of items) {
            if (!shouldMoveItem(item)) {
                continue; // Skip the items that are in the exclude list or already exist in the parent directory
            }

            const itemPath: string = path.join(projectDir, item);
            const destPath: string = path.join(parentDir, item);
            const itemStat: fs.Stats = await stat(itemPath);
            console.log(itemStat);

            // Move the file or directory
            if (itemStat.isDirectory() || itemStat.isFile()) {
                if (itemStat.isFile()) {

                    await fs.copy(itemPath, destPath, { overwrite: true });
                    // await rename(itemPath, destPath);
                    console.log(`Moved: ${itemPath} -> ${destPath}`);
                }
                else {
                    const source = path.join(__dirname, '..', item);
                    console.log(item);

                    const destination = path.join(__dirname, '../build', item);
                    try {
                        // let dir = parentDir + item;
                        // if (!fs.existsSync(dir)) {
                        //     fs.mkdirSync(dir);
                        // }
                        await fs.copy(source, destination, { overwrite: true });
                        // fs.renameSync(source, destination);
                        console.log('Folder moved successfully');
                    } catch (err) {
                        console.error('Error moving folder:', err);
                    }
                }
            }
        }
        const websiteSource = path.resolve(__dirname,'..', 'client', 'website');
        const websiteDestination = path.resolve(__dirname, '../build', 'client', 'website');
        console.log(`Copying from ${websiteSource} to ${websiteDestination}`);
        try {
            await fs.copy(websiteSource, websiteDestination, { overwrite: true });
            console.log('Website folder moved successfully');
        } catch (err) {
            console.error('Error moving website folder:', err);
        }
        let dir =  path.join(parentDir, 'content');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        console.log('All files and folders moved successfully.');
    } catch (err) {
        console.error('Error moving files:', err);
    }
}

moveFiles();