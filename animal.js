// Base Animal class
class Animal {
  constructor(species,name, location, size, image, type) {
	this.species=species;
    this.name = name;
    this.location = location;
    this.size = size;
    this.image = image;
    this.type = type;
  }
  
  //to render individual row of each table
  renderRecord() {
    const row = document.createElement('tr');
	
	const speciesCell=document.createElement("td");	
    const nameCell = document.createElement('td');
    const locationCell = document.createElement('td');
    const sizeCell = document.createElement('td');
    const imageCell = document.createElement('td');
    const actionCell = document.createElement('td');

	speciesCell.innerHTML=this.species;
    nameCell.innerHTML = this.getStyledName();
    locationCell.innerText = this.location;
    sizeCell.innerText = this.size;		
	imageCell.innerHTML = `<img src="${this.image}" alt="${this.name}" height="150" width="150"/>`;

	 
	actionCell.innerHTML = `
	     <button class="btn btn-warning btn-sm" onclick="handleEdit('${this.species}','${this.name}', '${this.type}')">Edit</button>
	     <button class="btn btn-danger btn-sm" onclick="handleDelete('${this.name}', '${this.type}')">Delete</button>
	   `;

	row.appendChild(speciesCell);
    row.appendChild(nameCell);   
    row.appendChild(sizeCell);
	row.appendChild(locationCell);
    row.appendChild(imageCell);
    row.appendChild(actionCell);
	  
    return row;
  }

  getStyledName() {
    return this.name; 
  }
  
   //Validate size
  static validateSize(size) {
	
      // Check if size is empty
      if (!size) {
        return 'Size cannot be empty.';      }

      // Check if size is a valid number
      const parsedSize = parseInt(size); 
      if (isNaN(parsedSize) || parsedSize <= 0) {
        return 'Size must be a valid positive number.';
      }

      return null; // No error, size is valid
    }
}

// child classes (BigCat, Dog, BigFish)
class BigCat extends Animal {
  constructor(species,name, location, size, image) {
	
    super(species,name, location, size, image, 'bigCat');
  }

  getStyledName() {  
   return this.name;
   }
}

class Dog extends Animal {
  constructor(species,name, location, size, image) {
    super(species,name, location, size, image, 'dog');
  }

  getStyledName() {
    return `<strong>${this.name}</strong>`; // Display name in bold
  }
}

class BigFish extends Animal {
  constructor(species,name, location, size, image) {
    super(species,name, location, size, image, 'bigFish');
  }

  getStyledName() {
    return `<span style="color: blue; font-style: italic; font-weight: bold;">${this.name}</span>`; // Bold, italic, and blue for Big Fish
  }
}

// Animal Table Class
class AnimalTable {
  constructor(animalType) {
    this.animalType = animalType; // The type of animal (bigCat, dog, bigFish)
    this.data = [];
    this.sortedBy = 'name'; 
	
	this.sortDirection = {
	     name: true,      // true for ascending, false for descending
	     location: true,  
	     size: true,      
	   };
  }
  
  
   //Method to edit animal record
   editAnimal(species,name,newName, location, size, image, type) {
       const animal = this.data.find(animal => animal.name === name);
       if (animal) { 
		animal.species=species;
		animal.name = newName;
         animal.location = location;
         animal.size = size;
         animal.image = image;
         animal.animalType = type;
		
         this.render();
       }
     } 
	 
	 //Method to remove animal entry from UI
	 deleteAnimal(name) {
	     this.data = this.data.filter(animal => animal.name !== name);
	     this.render();
	   }

	//Performs loading of data in async mode   
  	async loadData() {
    	try {
	  
      	const response = await fetch(`${this.animalType}.json`);  // Path to your JSON file
      	const animalsJson = await response.json();

      	// Filter the data based on animal type
      	this.data = animalsJson.filter(animalData => animalData.type === this.animalType)
                             .map(animalData => {
                               switch (animalData.type) {
                                 case 'bigCat':									
                                   return new BigCat(animalData.Species,animalData.name, animalData.location, animalData.size, animalData.image);
                                 case 'dog':
                                   return new Dog(animalData.Species,animalData.name, animalData.location, animalData.size, animalData.image);
                                 case 'bigFish':
                                   return new BigFish(animalData.Species,animalData.name, animalData.location, animalData.size, animalData.image);
                                 default:
                                   throw new Error(`Unknown animal type: ${animalData.type}`);
                               }
                             });

      	this.render(); // Render the table after loading data
   	 	} catch (error) {
      		console.error("Error loading animal data:", error);
    	}
  	}
  
  // Sort the data by name
    sortByColumn(column) {
		const sortOrder = this.sortDirection[column];
		
		this.data.sort((a, b) => {
		      if (column === 'name') {
		        return sortOrder ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
		      } else if (column === 'location') {
		        return sortOrder ? a.location.localeCompare(b.location) : b.location.localeCompare(a.location);
		      } else if (column === 'size') {
		        return sortOrder ? a.size - b.size : b.size - a.size;
		      }
		      return 0;
		    });

		    // Toggle sorting direction
		    this.sortDirection[column] = !sortOrder;
			
		    this.render();
    }
	
	// Update the sort icon based on the sorting state
	 updateSortIcons() {
		var sortIcons=['name', 'location', 'size'];
		
		sortIcons.forEach(column => {
		      let iconElement = document.getElementById(`${column}-sort-icon-${this.animalType}`);
			 			
		      iconElement.innerHTML = this.sortDirection[column] ? '&#8593;' : '&#8595;';
			  
		    });	 
	 }
	
  
  // Render the animal data into the table
  render() {
   
	 let tableBody = document.getElementById(`${this.animalType}-table`);
    tableBody.innerHTML = '';  // Clear existing rows

    this.data.forEach(animal => {
      tableBody.appendChild(animal.renderRecord());
    });
	this.updateSortIcons();
	
  }

  // Add a new animal
  addAnimal(species,name, location, size, image, type) {
    let newAnimal;
    if (type === this.animalType) {
      if (type === 'bigCat') {
        newAnimal = new BigCat(species,name, location, size, image);
      } else if (type === 'dog') {
        newAnimal = new Dog(species,name, location, size, image);
      } else if (type === 'bigFish') {
        newAnimal = new BigFish(species,name, location, size, image);
      }
      this.data.push(newAnimal);
      this.render(); // Re-render the table after adding
    }
  }
}
//End of class AnimalTable


// Add a new animal to the correct table
document.getElementById('add-animal').addEventListener('click', () => {
	let defaultImage;
	const species = prompt("Enter animal species: Big Cats/Dog/Big Fish");
	 const name = prompt("Enter animal name:");
	 const location = prompt("Enter animal location:");
	 
	 const size = prompt("Enter animal size (in kg):");

	

	 const sizeValidationError = Animal.validateSize(size);

	 if (sizeValidationError) {

		      alert(sizeValidationError);

		      return; // Exit function if validation fails

	 }

	 const type=prompt("enter type bigCat/dog/bigFish");
	 
	 defaultImage=type+".jpg";
	 const image = prompt("Enter image URL:",defaultImage);
	 
	 
	 if (type === 'bigCat') {
	    bigCatTable.addAnimal(species,name, location, size, image,type);
	  } else if (type === 'dog') {
	    dogTable.addAnimal(species,name, location, size, image,type);
	  } else if (type === 'bigFish') {
	    bigFishTable.addAnimal(species,name, location, size, image,type);
	  }
	  
	  
});

//Global fundtion to handle edit functionality
function handleEdit(species,animalName, animalType) {
	
  let animalTable;
  let animal = null;

  // Find the correct animal table to perform edit the animal
  if (animalType === 'bigCat') {
    animalTable = bigCatTable;
  } else if (animalType === 'dog') {
    animalTable = dogTable;
  } else if (animalType === 'bigFish') {
    animalTable = bigFishTable;
  }

  // Find the animal by name
  animal = animalTable.data.find(a => a.name === animalName);

  if (animal) {

	const newName = prompt("Edit Name:", animal.name) || animal.name;
    const newLocation = prompt("Edit Location:", animal.location) || animal.location;

	const newSize = prompt("Edit Size:", animal.size);
	const sizeValidationError = Animal.validateSize(newSize);

	if (sizeValidationError) {

		alert(sizeValidationError);
		return; // Exit function if validation fails

	}
    const newImage = prompt("Edit Image URL:", animal.image) || animal.image;
    const newType = prompt("Edit Animal Type (bigCat/dog/bigFish):", animal.type) || animal.type;

    // Update the animal
    animalTable.editAnimal(species,animal.name,newName, newLocation, newSize, newImage, newType);
  }
}


function handleDelete(animalName, animalType) {
  let animalTable;

  // Find the correct table to delete the animal
  if (animalType === 'bigCat') {
    animalTable = bigCatTable;
  } else if (animalType === 'dog') {
    animalTable = dogTable;
  } else if (animalType === 'bigFish') {
    animalTable = bigFishTable;
  }

  // Delete the animal
  animalTable.deleteAnimal(animalName);
}

//Sorting
document.getElementById('name-header-bigCat').addEventListener('click', () => {
  bigCatTable.sortByColumn('name');
});

document.getElementById('location-header-bigCat').addEventListener('click', () => {
  bigCatTable.sortByColumn('location');
});

document.getElementById('size-header-bigCat').addEventListener('click', () => {
  bigCatTable.sortByColumn('size');
});

// Add event listeners for each column header to trigger sorting for Dog table
document.getElementById('name-header-dog').addEventListener('click', () => {
  dogTable.sortByColumn('name');
});

document.getElementById('location-header-dog').addEventListener('click', () => {
  dogTable.sortByColumn('location');
});



// Add event listeners for each column header to trigger sorting for BigFish table

document.getElementById('size-header-bigFish').addEventListener('click', () => {
  bigFishTable.sortByColumn('size');
});


// Initialize tables for each animal type
const bigCatTable = new AnimalTable('bigCat');
const dogTable = new AnimalTable('dog');
const bigFishTable = new AnimalTable('bigFish');

// Load data from JSON and render tables
bigCatTable.loadData();
dogTable.loadData();
bigFishTable.loadData();
