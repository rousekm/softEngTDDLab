'use strict';

var test = require('tape');
// Object containing the interns we want to evaluate
var potentialHires = require('./input/groupOne.json');
var interns = potentialHires.interns;

var recruiter = require('../recruiter.js');
var util = require('../util.js');

test('util.getValueFromWageAndExp', function(t) {
  t.ok(util.getValueFromWageAndExp(31, 1) > util.getValueFromWageAndExp(30, 1), 'factors in wage');

  if (util.getValueFromWageAndExp(30, 1) > util.getValueFromWageAndExp(30, 0)) {
  	t.pass('factors in experiance');
  } else {
  	t.fail('does not factor in experiance');
  }

  t.equal(util.getValueFromWageAndExp(34, 1.3), false, 
  	"getValueFromWageAndExp catches a partial year input and returns false");

  t.end();
});

test('util.sortInternObjects', function(t) {
	var inputArr = [interns[0], interns[1], interns[2], interns[3]];
	inputArr[0].metric = 3;
	inputArr[1].metric = 1;
	inputArr[2].metric = 2;
	inputArr[3].metric = 0;

	// Lets get the input sorted manually, in the expected array
	var expectedArr = inputArr.slice(); //copying array in new location
	expectedArr = [
		expectedArr[0], // 3
		expectedArr[2], // 2
		expectedArr[1], // 1
		expectedArr[3]  // 0
	];

	// Lets make a copy of the input to sort with the function 
	var actualArr = inputArr.slice();

	// Sort by reference (in-place)
	util.sortInternObjects(actualArr);

  t.deepEqual(actualArr, expectedArr, 'bascially sorts by metric');

  // Let's throw a wrench in it and change our metrics
  actualArr[0].metric = 0;
  inputArr[0].metric = 0;

  expectedArr = [
		inputArr[2], // 2
		inputArr[1], // 1
		inputArr[0], // 0
		inputArr[3]  // 0
	];

	util.sortInternObjects(actualArr);

	t.deepEqual(actualArr, expectedArr, 'preserves order of same-metric objects');

  t.end();
});

// Your tests go here  (methods reference: https://www.npmjs.com/package/tape#testname-opts-cb )
test('bracketFromGPA', function(t) {
	t.deepEqual(recruiter.bracketFromGPA(3.5),3,"returns bracket three");
	t.deepEqual(recruiter.bracketFromGPA(3.4),2,"returns bracket two");
	t.deepEqual(recruiter.bracketFromGPA(2.99),1,"returns bracket 1");
	t.deepEqual(recruiter.bracketFromGPA(2.49),0,"returns bracket 0");

	t.end();
});

test('recruiterFunction', function(t) {
	var collArr = [interns[0], interns[1], interns[2], interns[3]];

	var inputArr = collArr.slice();
	//Create Lists of interns that have the properties we want to test
	// List 1: Check that if all value to company are different, GPA is ignored
	inputArr[0].degree = "petroleum engineering";
	inputArr[1].degree = "petroleum engineering";
	inputArr[2].degree = "computer science & engineering";
	inputArr[3].degree = "physician assistant studies";

	inputArr[0].gpa = 4.0;
	inputArr[1].gpa = 2.7;
	inputArr[2].gpa = 3.5;
	inputArr[3].gpa = 2.9;

	inputArr[0].experiance = 0;
	inputArr[1].experiance = 3; // uses experiance to change value to company instead of degree
	inputArr[2].experiance = 0;
	inputArr[3].experiance = 0;

	//Copy list of interns and sort it manually
	var expectedArr = inputArr.slice(); //copying array in new location
	expectedArr = [
		expectedArr[1], // 
		expectedArr[0], // 
		expectedArr[3], // 
		expectedArr[2]  // 
	];

	// Lets make a copy of the input to sort with the function 
	var actualArr = inputArr.slice();

	// do something (in-place)
	actualArr = recruiter.recruiter(actualArr);

  t.deepEqual(actualArr, expectedArr, 'check: ignores GPA if wages all different, checks that experiance affects wage');

	// List 2: Check that if value to company are same, GPA is tie breaker
	// checking in 2 ways, same degree & diff degree with same wage
	// note: there is no tie breaker post GPA, so they will appear in the same order
	inputArr[0].degree = "mining engineering";
	inputArr[1].degree = "petroleum engineering";
	inputArr[2].degree = "petroleum engineering";
	inputArr[3].degree = "chemical engineering";

	inputArr[0].gpa = 4.0;
	inputArr[1].gpa = 2.7;
	inputArr[2].gpa = 3.1;
	inputArr[3].gpa = 3.5;

	inputArr[0].experiance = 0;
	inputArr[1].experiance = 2;
	inputArr[2].experiance = 2;
	inputArr[3].experiance = 0;

	//Copy list of interns and sort it manually
	var expectedArr = inputArr.slice(); //copying array in new location
	expectedArr = [
		expectedArr[2], // 
		expectedArr[1], // 
		expectedArr[3], // 
		expectedArr[0]  // 
	];

	// Lets make a copy of the input to sort with the function 
	var actualArr = inputArr.slice();

	// do something (in-place)
	actualArr = recruiter.recruiter(actualArr);

  t.deepEqual(actualArr, expectedArr, 'uses GPA to tie break when wages are the same, checks for multiple causes of same wage');

	// List 3: Check that exceptions - GPA < 2.5, unknown degrees, astrology
	collArr = [interns[0], interns[1], interns[2], interns[3], interns[4]];
	inputArr = collArr.slice()
	inputArr[0].degree = "ugg";
	inputArr[1].degree = "petroleum engineering";
	inputArr[2].degree = "astrology";
	inputArr[3].degree = "astrology";
	inputArr[4].degree = "astrology";

	inputArr[2].experiance = 1;
	inputArr[4].experiance = 1;
	inputArr[3].experiance = 5;

	inputArr[0].gpa = 4.0;
	inputArr[1].gpa = 2.49;
	inputArr[2].gpa = 3.1;
	inputArr[3].gpa = 1.5;
	inputArr[4].gpa = 2.3;

	//Copy list of interns and sort it manually
	var expectedArr = inputArr.slice(); //copying array in new location
	expectedArr = [
		expectedArr[4],
		expectedArr[2],
		expectedArr[3] // 
	];

	// Lets make a copy of the input to sort with the function 
	var actualArr = inputArr.slice();

	// do something (in-place)
	recruiter.recruiter(actualArr);

  t.deepEqual(actualArr, expectedArr, 'returns astrology when all candidates are bad, removes low GPA, removes unknown degree');

	// List 4: Check that astrology loses to any qualified candidate
	inputArr[0].degree = "child development";
	inputArr[1].degree = "boots";
	inputArr[2].degree = "pastoral ministry";
	inputArr[3].degree = "youth ministry";
	inputArr[4].degree = "astrology";

	inputArr[0].experiance = 0;
	inputArr[2].experiance = 0;
	inputArr[3].experiance = 0;
	inputArr[4].experiance = 10;

	inputArr[0].gpa = 2.51;
	inputArr[1].gpa = 3.2;
	inputArr[2].gpa = 2.50;
	inputArr[3].gpa = 3.1;
	inputArr[4].gpa = 4.0;

	//Copy list of interns and sort it manually
	var expectedArr = inputArr.slice(); //copying array in new location
	expectedArr = [
		expectedArr[3],
		expectedArr[2],
		expectedArr[0],
		expectedArr[4]
	];

	// Lets make a copy of the input to sort with the function 
	var actualArr = inputArr.slice();

	// do something (in-place)
	recruiter.recruiter(actualArr);

  t.deepEqual(actualArr, expectedArr, 'returns astrology only after good candidates');

	// List 5: Check program will return an empty list
	inputArr[0].degree = "";
	inputArr[1].degree = "petroleum engineering";
	inputArr[2].degree = "gobbledy gook";
	inputArr[3].degree = "computer science";

	inputArr[0].gpa = 4.0;
	inputArr[1].gpa = 2.49;
	inputArr[2].gpa = 3.1;
	inputArr[3].gpa = 1.0;

	//Copy list of interns and sort it manually
	var expectedArr = inputArr.slice(); //copying array in new location
	expectedArr = [];

	// Lets make a copy of the input to sort with the function 
	var actualArr = inputArr.slice();

	// do something (in-place)
	recruiter.recruiter(actualArr);

  t.deepEqual(actualArr, expectedArr, 'will return empty list when no qualified candidates');

	t.end();
});
// test('Test Name', function(t) {

//   if (/*some condition*/) {
//   	t.pass('passes condition');
//   } else {
//   	t.fail('does not pass condition');
//   }

// and/or an actual comparison like t.equal();

//   t.end();
// });
