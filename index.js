var fs = require('fs'),
	Q = require('q'),
	parseString = require('xml2js').parseString,
	filePath,
	xmlData;

/* File path parameter */

try {
	if (!process.argv[2]) {
		throw new Error('Please enter a file path');
	}
} catch (e) {
    console.error(e);
    return false;
}


filePath = process.argv[2];	

/* File existence */

try {
	if (!fs.existsSync(filePath)) {
		throw new Error('File path does not match any file');
	}
} catch (e) {
    console.error(e);
    return false;
}

/* Parsing */

xmlData = fs.readFileSync(filePath);

parseString(xmlData, function (err, result) {
	try {
		if (err) {
			throw new Error('Error parsing the data');
		}
	} catch (e) {
	    console.error(e);
	    return false;
	}


  var model = result.COLLADA.library_geometries[0].geometry[0].$.id.toLowerCase();
	console.log('Model name: ' + model);

	var subsets = result.COLLADA.library_effects[0].effect;
	console.log('Number of subsets: ' + subsets.length);

  if (!subsets) {
		try {
			throw new Error('Error parsing the data 2');
		} catch (e) {
		    console.error(e);
		    return false;
	  }
  }

  var filename = filePath.substring(0,filePath.length - 3) + 'csv';

  var csvContent = '';
	csvContent += 'post_slug;';
	csvContent += 'post_title;';
	csvContent += 'post_content;';
	csvContent += 'post_status;';
	csvContent += 'post_category;';
	csvContent += 'post_tag\n';

	/* Model */

	csvContent += model + ';';
	csvContent += model + ';';
	csvContent += model + ';';
	csvContent += 'Draft;';
	csvContent += 'model;';
	csvContent += '\n';

	/* Pieces */

  subsets.forEach(function(subset){
  	var thisName = subset.$.id.toLowerCase();
		csvContent += model + '____' + thisName + ';';
		csvContent += thisName + ';';
		csvContent += thisName + ';';
		csvContent += 'Draft;';
		csvContent += 'piece;';
		csvContent += model + '\n';
  });

	fs.writeFile(filename, csvContent, function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log(filename + ' was saved!');
		}
	});

});