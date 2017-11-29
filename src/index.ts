import * as ts from 'typescript';
import chalk from 'chalk';

const filePath = 'test.ts';

const compilerOptions: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2017,
  module: ts.ModuleKind.ES2015
};

function transformer<T extends ts.Node>(context: ts.TransformationContext) {
    return (rootNode: T) => {
        function visit(node: ts.Node): ts.Node {
            console.log(ts.SyntaxKind[node.kind]);
            return ts.visitEachChild(node, visit, context);
        }
        return ts.visitNode(rootNode, visit);
    }
}

const program = ts.createProgram(['test.ts'], compilerOptions);
const sourceFiles = program
  .getSourceFiles()
  .filter(sf => !sf.isDeclarationFile);
const typeChecker = program.getTypeChecker();

const result = ts.transform(sourceFiles[0], [transformer]);

if (result.diagnostics && result.diagnostics.length) {
    console.log(chalk.yellow(`
    ======================= Diagnostics for ${filePath} =======================
    `));
    for (const diag of result.diagnostics) {
        if (diag.file && diag.start) {
            const pos = diag.file.getLineAndCharacterOfPosition(diag.start);
            console.log(`(${pos.line}, ${pos.character}) ${diag.messageText}`)
        }
    }
}

ts
  .createPrinter()
  .printNode(ts.EmitHint.SourceFile, result.transformed[0], sourceFiles[0]);
