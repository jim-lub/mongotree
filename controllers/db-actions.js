/* jshint esversion: 6 */
const {mongoose} = require('./db-connect');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Folder} = require('./../models/folder');

let newFolder = (data) => {
  return new Promise((resolve, reject) => {

    data._id = new ObjectID();
    data.toggle = 1;
    if (!data.name || !data._id) { reject('Invalid folder name'); }
    if (!data.parentID) {
      data.parentID = 0;
    } else {
      getFolderById(data.parentID).then((result) => {
        if (result.length === 0) { reject('Parent folder does not exist'); }
      })
      .catch((e) => reject(e));
    }

    setFolderOrder(data.parentID).then((result) => {
      data.order = result;
      let folder = new Folder(data);
      folder.save()
      .then((folder) => resolve(folder))
      .catch((e) => reject(e));
    })
    .catch((e) => reject(e));

  });
};

let deleteFolder = (data) => {
  return new Promise((resolve, reject) => {
    getFolderById(data._id).then((result) => {
      if (!result) { reject(null); }

      fetchFolders().then((result) => {
        deleteFolder_getChildren_recursive(result, [data], data._id).then((result) => {
          Folder.deleteMany()
          .where('_id')
          .in(result)
          .exec((err, result) => resolve(`Deleted ${result.n} folder(s).`));
        });
      });
    })
    .catch((e) => reject(e));
  });
};

let deleteFolder_getChildren_recursive = (inputArray, outputArray, parentID) => {
  return new Promise((resolve, reject) => {
    (() => {
      inputArray.forEach((cur, i) => {
        if (cur.parentID.toString() === parentID.toString()) {
          outputArray.push(cur);
          deleteFolder_getChildren_recursive(inputArray, outputArray, cur._id).then((result) => { return; });
        }
      });
      resolve(outputArray);
    })()
    .then(() => resolve(outputArray))
    .catch((e) => reject(e));
  });
};

let moveFolder = (data, direction) => {
  return new Promise((resolve, reject) => {
    Promise.resolve(data)
      .then(data => {
        return getFolderById(data._id);
      })
      .then(data => {
        return getFolderByParentId(data.parentID).then(result => {
          return {
            current: data,
            array: result
          };
        });
      })
      .then(data => {
        return moveFolder_update(data, direction);
      })
      .then(result => {
        resolve(result);
      })
      .catch(e => reject(e));
  });
};

let moveFolder_update = (data, direction) => {
  return new Promise((resolve, reject) => {
    let array = [];
    let index = _.findIndex(data.array, ['_id', data.current._id]);
    if (direction.direction === 'up') {
      array = data.array.slice((index - 1), (index + 1));
      if (array.length === 1) { reject('Already top folder'); }
      let value = {
        one: array[0].order,
        two: array[1].order
      };
      array[0].order = value.two;
      array[1].order = value.one;
    } else if (direction.direction === 'down') {
      array = data.array.slice(index, (index + 2));
      if (array.length === 1) { reject('Already bottom folder'); }
      let value = {
        one: array[0].order,
        two: array[1].order
      };
      array[0].order = value.two;
      array[1].order = value.one;
    } else {
      reject('Direction invalid.');
    }
    console.log(direction.direction);
    Promise.resolve()
      .then(_ => {
        console.log(`Moved ${array[0].name} to order ${array[0].order}`);
        return Folder.findOneAndUpdate({
          _id: array[0]._id
        },{
          $set: {order: array[0].order}
        });
      })
      .then(_ => {
        console.log(`Moved ${array[1].name} to order ${array[1].order}`);
        return Folder.findOneAndUpdate({
            _id: array[1]._id
        },{
          $set: {order: array[1].order}
        });
      })
      .then(_ => {
        resolve('Folder moved.');
      })
      .catch(e => reject(e));
  });
};


// Returns a single object
let getFolderById = (_id) => {
  return new Promise((resolve, reject) => {
    Folder.find({_id}).limit(1).then((result) => resolve(result[0]))
    .catch((e) => reject(e));
  });
};

// Returns an array of objects
let getFolderByParentId = (_id) => {
  return new Promise((resolve, reject) => {
    Folder.find({parentID: _id}).then((result) => resolve(_.sortBy(result, ['order']), [], 0, 0))
    .catch((e) => reject(e));
  });
};

let setFolderOrder = (parentID) => {
  return new Promise((resolve, reject) => {
    fetchFolders().then((array) => {
      return _.filter(array, {parentID});
    })
    .then((array) => {
      resolve(array.length + 1);
    })
    .catch((e) => reject(e));
  });
};

let fetchFolders = () => {
  return new Promise((resolve, reject) => {
    let array = [];

    Folder.find().then((result) => {
      result.forEach((cur) => {
        let obj = {
          _id: cur._id,
          parentID: cur.parentID,
          name: cur.name,
          order: cur.order,
          depth: 0,
          state: 0,
          hasChild: true
        };
        array.push(obj);
      });
      array.forEach((cur) => {
        if(_.findIndex(array, ['parentID', cur._id.toString()]) === -1){ cur.hasChild = false; }
      });
      resolve(array);
    })
    .catch((e) => reject(e));
  });
};


module.exports = {
  newFolder,
  deleteFolder,
  moveFolder,
  fetchFolders,
  getFolderById,
  getFolderByParentId
};
