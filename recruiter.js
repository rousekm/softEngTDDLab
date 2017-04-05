'use strict';

// Object containing starting wages for various 4 year degrees
var degreeSWage = require('./degreeSWage.json');
// File containing some of our utility functions (already written)
var util = require('./util.js');

//TODO: You need to write this function AND utilize it.
// bracketFromGPA(decimal GPA);
function bracketFromGPA(gpa) {
	if(gpa >= 3.5){
	return 3;
	}
	else if (gpa >= 3.0){
	return 2;
	}
	else if (gpa >= 2.5){
	return 1;
	}
	else{
	return 0;
	}
}

// TODO: recruiter( Array of hireables )
function recruiter(internArr) {

	// Below is just to help show the syntax you need,
	// you'll need to process ALL of the hireables like this one and sort
	var iname;
	var idegr;
	var igpa;
	var iexp;
	var iwage, ivalue, ibracket, imetric;
	var astrology = [] // keep track of indices of astrology majors
	var employable = 0 // keep track of employable non-astrology majors

	for (i=0; i < internArr.length; i++){
		iname = internArr[i].name;
		idegr = internArr[i].degree;
		igpa = internArr[i].gpa;
		iexp = internArr[i].experiance;

		// Yep, you can use strings as an "index" (technically it's a property) in JavaScript
		idegr = idegr.toLowerCase();
		iwage = degreeSWage[idegr];
		if (iwage === undefined){
			imetric = 0;
		}
		} else {
			// You should use these functions at some point
			if (idegr === "astrology"){
				// ensure astrology major's value to the company is lower than everybody else
				ivalue = util.getValueFromWageAndExp(1,Math.floor(iexp));
				ibracket = bracketFromGPA(igpa);
				imetric = ivalue + .05*ibracket;
				employable++;
			} else {
				ivalue = util.getValueFromWageAndExp(iwage, Math.floor(iexp));
				ibracket = bracketFromGPA(igpa);
				//ivalue increases by .2
				if (ibracket != 0){
					imetric = ivalue + .05*ibracket;
					employable++;
				} else {
					imetric = 0;
				}
			}
		}
		// We really want to add our sorting number "metric" to objects (it really is this easy)
		internArr[i].metric = imetric;
	}
	// and then sort them all (it doesn't return anything, it modifies the array sent)
	util.sortInternObjects(internArr);


	// Output 
	// An array of HIREABLE 'intern objects' (in order of most valueable to least valueable)
	// with at least the properties "name", "metric", "degree"
	// You can come up with any number you want for "metric" as long as it corresponds to the spec
	// and people earlier in the array have equal or greater values for "metric" than
	// people further down.

	// if employable === 0, we only want the interns with astrology degrees
	if (employable === 0){
		var Empty = [];
		return Empty;
	} else {
		return internArr.slice(0,employable);
	}
};

module.exports = {
	recruiter: recruiter,
	bracketFromGPA: bracketFromGPA
};
