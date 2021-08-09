const replace = require('replace-in-file');

const headerOptions = {
  files: 'notion-docs/**/*.md',
  from: /##/g,
  to: '#',
};

const imagePathOptions = {
  files: 'notion-docs/**/*.md',
  from: /.\/images\//g,
  to: '',
};

try {
  const headerResults = replace.sync(headerOptions);
  console.log('Headers Replaced:', headerResults);
} catch (error) {
  console.error('Error occurred:', error);
}

try {
  const imagePathResults = replace.sync(imagePathOptions);
  console.log('Image Paths:', imagePathResults);
} catch (error) {
  console.error('Error occurred:', error);
}
