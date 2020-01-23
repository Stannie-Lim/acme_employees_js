const employees = [
  { id: 1, name: 'moe'},
  { id: 2, name: 'larry', managerId: 1},
  { id: 4, name: 'shep', managerId: 2},
  { id: 3, name: 'curly', managerId: 1},
  { id: 5, name: 'groucho', managerId: 3},
  { id: 6, name: 'harpo', managerId: 5},
  { id: 8, name: 'shep Jr.', managerId: 4},
  { id: 99, name: 'lucy', managerId: 1}
];

const spacer = (text)=> {
  if(!text){
    return console.log('');
  }
  const stars = new Array(5).fill('*').join('');
  console.log(`${stars} ${text} ${stars}`);
}

// ################################################################################ find employee
/*
    @params: name of employee to find, array to search for employee in
    @return: the array cell containing the name of the employee

    simply uses a for loop to find the name, returns the cell
*/
const findEmployeeByName = (name, array) => {
    for(let i = 0; i < array.length; i++) {
        if(array[i].name === name) {
            return array[i];
        }
    }
}

spacer('findEmployeeByName Moe')
// given a name and array of employees, return employee
console.log(findEmployeeByName('moe', employees));//{ id: 1, name: 'moe' }
spacer('')

// ###############################################################################

// ############################################################################### find manager

/*
    @params: the array cell of the person to find the manager of, array to search
    @return: array cell containing the person whose id is the manager

    also uses a for loop, similar to findemployeebyname
*/
const findManagerFor = (employee, array) => {
    if(employee !== undefined) {
        for(let i = 0; i < array.length; i++) {
            if(array[i].id === employee.managerId) {
                return array[i];
            }
		}
    }
}   

spacer('findManagerFor Shep Jr')
//given an employee and a list of employees, return the employee who is the manager
console.log(findManagerFor(findEmployeeByName('shep Jr.', employees), employees));//{ id: 4, name: 'shep', managerId: 2 }
spacer('')

// ################################################################################

// ################################################################################ find coworkers
/*
    @params: array cell of employee to find coworkers of, array to search
    @return: object array containing employees with same manager as each other

    loops through entire array. if the manager id matches up, push it onto 
    return array. keep in mind that if they're the same person, they should not
    be pushed onto array.
*/
const findCoworkersFor = (employee, array) => {
    let coworkers = [];
    for(let i = 0; i < array.length; i++) {
        if(array[i].managerId === employee.managerId && array[i].id !== employee.id) {
            coworkers.push(array[i]);
        }
    }
    return coworkers;
}

spacer('findCoworkersFor Larry')

//given an employee and a list of employees, return the employees who report to the same manager
console.log(findCoworkersFor(findEmployeeByName('larry', employees), employees));/*
[ { id: 3, name: 'curly', managerId: 1 },
  { id: 99, name: 'lucy', managerId: 1 } ]
*/

spacer('');

// ###############################################################################

// ############################################################################### find management 
/*
    @params the employee to find management chain for, array of data
    @return management chain
*/

const findManagementChainForEmployee = (employee, array) => {
    let management = [];
    /*
    management.push(findManagerFor(employee, array));
    let manager = findManagerFor(employee, array);
    management.push(findManagerFor(manager, array));
    let manager1 = findManagerFor(manager, array);
    management.push(findManagerFor(manager1, array));
    */
    while(findManagerFor(employee, array) !== undefined) {
        management.unshift(findManagerFor(employee, array));
        employee = findManagerFor(employee, array);
    }

    return management;
}

spacer('findManagementChain for moe')
//given an employee and a list of employees, return a the management chain for that employee. The management chain starts from the employee with no manager with the passed in employees manager 
console.log(findManagementChainForEmployee(findEmployeeByName('moe', employees), employees));//[  ]
spacer('');

spacer('findManagementChain for shep Jr.')
console.log(findManagementChainForEmployee(findEmployeeByName('shep Jr.', employees), employees));/*
[ { id: 1, name: 'moe' },
  { id: 2, name: 'larry', managerId: 1 },
  { id: 4, name: 'shep', managerId: 2 }]
*/
spacer('');

// ###############################################################################

// ############################################################################### generate tree

/*
	@params employee to find the reports for, list of employees
	@return the management tree of the employee
	recursively calculates the chain of command of the company
*/
const generateTreeHelper = (employee, list) => {
	const reports = list.filter(employ => employ.managerId === employee.id && employ.id !== employee.id);

	//base case
	if(reports.length === 0) {
		return [];
	
	//recursive step
	} else {
		let newReports = reports.map(report => {
			return {
				...report, 
				reports: generateTreeHelper(report, list)
			}
		});
		return newReports;
	}
}

/*
	@params just the list of employees
	@return the entire tree
	driver function for generate tree
*/
const generateManagementTree = (array) => {
	let list = JSON.parse(JSON.stringify(array));
	let ceo = list.filter(employee => {
		return employee.managerId === undefined;
	});
	return generateTreeHelper(ceo, list)[0];
	/*
	for(let i = 0; i < list.length; i++) {
		list[i].reports = [];
		if(list[i].managerId === undefined) {
			tree = list[i];
		} 
		tree.reports = findCoworkersFor(list[i], list);
		tree.reports.push(list[i]);
	}
*/
}

spacer('generateManagementTree')
//given a list of employees, generate a tree like structure for the employees, starting with the employee who has no manager. 
//Each employee will have a reports property which is an array of the employees who report directly to them.
console.log(JSON.stringify(generateManagementTree(employees), null, 2));
/*
{
  "id": 1,
  "name": "moe",
  "reports": [
    {
      "id": 2,
      "name": "larry",
      "managerId": 1,
      "reports": [
        {
          "id": 4,
          "name": "shep",
          "managerId": 2,
          "reports": [
            {
              "id": 8,
              "name": "shep Jr.",
              "managerId": 4,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "name": "curly",
      "managerId": 1,
      "reports": [
        {
          "id": 5,
          "name": "groucho",
          "managerId": 3,
          "reports": [
            {
              "id": 6,
              "name": "harpo",
              "managerId": 5,
              "reports": []
            }
          ]
        }
      ]
    },
    {
      "id": 99,
      "name": "lucy",
      "managerId": 1,
      "reports": []
    }
  ]
}
*/
spacer('');

// ###############################################################################

// ############################################################################### display tree 

/*
	@params the branch of the tree's reports, number of dashes 
	@return nothing, just console.logs stuff

*/
const displayManagementTree = (tree, numDashes = 0) => {
	let str = "";
	let dashes = '-';
	for(let i = 0; i < numDashes; i++) {
		str += dashes;
	}
	console.log(`${str}${tree.name}`);
	if(tree.reports.length === 0) {
		return;
	} else {
		tree.reports.forEach(report => {
			displayManagementTree(report, numDashes + 1);
		});
	}
}

spacer('displayManagementTree')
//given a tree of employees, generate a display which displays the hierarchy
displayManagementTree(generateManagementTree(employees));/*
moe
-larry
--shep
---shep Jr.
-curly
--groucho
---harpo
-lucy
*/