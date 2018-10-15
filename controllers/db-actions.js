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

let getFolderById = (_id) => {
  return new Promise((resolve, reject) => {
    Folder.find({_id}).limit(1).then((result) => resolve(result))
    .catch((e) => reject(e));
  });
};

let getFolderByParentId = (_id) => {
  return new Promise((resolve, reject) => {
    Folder.find({parentID: _id}).then((result) => resolve(result))
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
  fetchFolders,
  getFolderById,
  getFolderByParentId
};
