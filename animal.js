// Base Animal class
//Edit and delete working
class Animal {
  constructor(species,name, location, size, image, type) {
	this.species=species;
    this.name = name;
    this.location = location;
    this.size = size;
    this.image = image;
    this.type = type;
  }
  
  renderRow() {
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
    return this.name; // You can override this in subclasses for styling (e.g., bold, italic)
  }
}

// Specific Animal Types (BigCat, Dog, BigFish)
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
    this.sortedBy = 'name'; // Default sorting by name
    this.sortDirection = 'asc'; // Default sort direction: ascending
  }
  
  editAnimalTest(oldName) {
  const animal = this.data.find(a => a.name === oldName);

     if (animal) {
       const newName = prompt("Edit name:", animal.name);
       const newLocation = prompt("Edit location:", animal.location);
       const newSize = prompt("Edit size:", animal.size);
       const newImage = prompt("Edit image URL:", animal.image);
       const newType = prompt("Edit animal type (bigCat, dog, bigFish):", animal.type);

       // Update the animal's details
       animal.name = newName;
       animal.location = newLocation;
       animal.size = newSize;
       animal.image = newImage;
       animal.type = newType;

       this.render(); // Re-render after editing
     }
   }
   
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
	 
	 deleteAnimal(name) {
	     this.data = this.data.filter(animal => animal.name !== name);
	     this.render();
	   }

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
  


  // Sort animals by field - big cat1
  sortBy(field) {
    this.data.sort((a, b) => {
  	
      if (field === "size") {
        return a.size - b.size; // Sort by size numerically
      }
      return a[field].localeCompare(b[field]); // Sort by name or location alphabetically
    });
  }

  
  // Sort the animals based on selected field
  sortAnimals(field) {
    // Toggle sort direction
    if (this.sortedBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedBy = field;
      this.sortDirection = 'asc'; // Default to ascending on a new sort field
    }

    this.data.sort((a, b) => {
      if (this.sortDirection === 'asc') {
        return this.compareValues(a, b, field);
      } else {
        return this.compareValues(b, a, field);
      }
    });

    this.render(); // Re-render the table after sorting
  }

  // Comparison function based on field (name, location, or size)
  compareValues(a, b, field) {
    if (field === 'name' || field === 'location') {
      return a[field].localeCompare(b[field]);
    } else if (field === 'size') {
      return a[field] - b[field];
    }
    return 0;
  }

  // Render the animal data into the table
  render() {
   
	 let tableBody = document.getElementById(`${this.animalType}-table`);
    tableBody.innerHTML = '';  // Clear existing rows

    this.data.forEach(animal => {
      tableBody.appendChild(animal.renderRow());
    });
  }

  // Add a new animal
  addAnimal(species,name, location, size, type) {
    let newAnimal;
    if (type === this.animalType) {
      if (type === 'bigCat') {
        newAnimal = new BigCat(species,name, location, size, "tiger1.jpg");
      } else if (type === 'dog') {
        newAnimal = new Dog(species,name, location, size, "rottweiler.jpg");
      } else if (type === 'bigFish') {
        newAnimal = new BigFish(species,name, location, size, "whale.jpg");
      }
      this.data.push(newAnimal);
      this.render(); // Re-render the table after adding
    }
  }
}

// Initialize tables for each animal type
const bigCatTable = new AnimalTable('bigCat');
const dogTable = new AnimalTable('dog');
const bigFishTable = new AnimalTable('bigFish');

// Load data from JSON and render tables
bigCatTable.loadData();
dogTable.loadData();
bigFishTable.loadData();

// Add a new animal to the correct table
document.getElementById('add-animal').addEventListener('click', () => {

	const species = prompt("Enter animal species:");
	 const name = prompt("Enter animal name:");
	 const location = prompt("Enter animal location:");
	 const size = parseInt(prompt("Enter animal size (in kg):"));
	// const image = prompt("Enter image URL:");
	 const type=prompt("enter type bigCat/dog/bigFish");
	 
	 if (type === 'bigCat') {
	    bigCatTable.addAnimal(species,name, location, size, type);
	  } else if (type === 'dog') {
	    dogTable.addAnimal(species,name, location, size, type);
	  } else if (type === 'bigFish') {
	    bigFishTable.addAnimal(species,name, location, size, type);
	  }
	  
	  
});


function handleEdit(species,animalName, animalType) {
  let animalTable;
  let animal = null;

  // Find the correct table to edit the animal
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
    // Prompt for the new values
    const newName = prompt("Edit Name:", animal.name) || animal.name;
    const newLocation = prompt("Edit Location:", animal.location) || animal.location;
    const newSize = parseFloat(prompt("Edit Size:", animal.size)) || animal.size;
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
document.getElementById('sort-cat-species').addEventListener('click', () => {
	
	 bigCatTable.sortBy("species");  
	 bigCatTable.render();
	
 
});

document.getElementById('sort-cat-name').addEventListener('click', () => {
	
	 bigCatTable.sortBy("name");  
	 bigCatTable.render();
	
 
});


document.getElementById('sort-cat-location').addEventListener('click', () => {

	 bigCatTable.sortBy("location");  
	 bigCatTable.render();
	
 
});



document.getElementById('sort-cat-size').addEventListener('click', () => {
	
	 bigCatTable.sortBy("size");  
	 bigCatTable.render();
	
 
});

//sorting - dog

document.getElementById('sort-dog-name').addEventListener('click', () => {
	
	 dogTable.sortBy("name");  
	 dogTable.render();
	
 
});


document.getElementById('sort-dog-location').addEventListener('click', () => {

	 dogTable.sortBy("location");  
	 dogTable.render();
	
 
});


document.getElementById('sort-fish-size').addEventListener('click', () => {

	 bigFishTable.sortBy("size");  
	 bigFishTable.render();
	
 
});

