const ivm = require('isolated-vm');

async function executeScript(code, call) {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = isolate.createContextSync();
const regex = /console\.log\(([^)]*)\)/g;

  // Replace all matches with log(...)
  code= code.replace(regex, (match, p1) => {
    return `log(${p1})`;
  });
 call=call.replace(regex, (match, p2) => {
  return `log(${p2})`;
});

  // Compile and run the script
  let logOutput = [];
  const jail = context.global;

  // Make the global object available in the context as `global`
  jail.setSync('global', jail.derefInto());
  
  // Create a basic `log` function for the new isolate to use
  jail.setSync('log', new ivm.Callback(function(...args) {
      logOutput.push(...args)
  }));
  
  // Test the log function
  
  async function runScript() {
    let res;
    try {
      const hostile = await isolate.compileScript(code);
      const start = process.hrtime();
      await hostile.run(context);
      res = await context.eval(`${call}.toString()`);

      const end = process.hrtime(start);
      const cpuTime = end[0] + end[1] / 1e9;
      const used_heap_size = isolate.getHeapStatisticsSync().used_heap_size;
      return {
        result: res,
        time: cpuTime.toString(),
        memory: used_heap_size / 1024, // Convert bytes to kilobytes
        console: [...logOutput],
      };
    } catch (err) {
      console.error(err);
      return {
        result: null,
        time: null,
        memory: null,
        console: logOutput,
        error: err.message,
      };
    }
  }

  const result = await runScript();
  
  // Release resources
  context.release();
  isolate.dispose();

  return result;
}

module.exports = executeScript;