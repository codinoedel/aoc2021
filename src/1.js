var inputFileName = './1.input';
return stat(inputFileName).then(function (err, stats) { return (open(inputFileName).then(function (err, fd) { return function (, buff, read) {
    if (buff === void 0) { buff = Buffer.alloc(stats.size); }
    return ;
}; }, (fd, buff).then(function (err) { return (console.log('input', buff.toString())); }))); });
export {};
