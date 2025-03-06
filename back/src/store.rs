use std::collections::BTreeMap;
use std::ops::{Index, IndexMut};

use serde::{Deserialize, Serialize};

use crate::status::Status;
use crate::title::Title;
use crate::description::Description;

#[derive(Clone)]
pub struct ImageStore {
    images: BTreeMap<ImageId, Image>,
    counter: u64,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub struct ImageId(u64);

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Image {
    pub id: ImageId,
    pub title: Title,
    pub description: Description,
    pub status: Status,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ImageDraft {
    pub title: Title,
    pub description: Description,
}

#[derive(Clone, Debug, PartialEq, Eq, Deserialize)]
pub struct ImagePatch {
    pub title: Option<Title>,
    pub description: Option<Description>,
    pub status: Option<Status>,
}

impl ImageStore {
    pub fn new() -> Self {
        Self {
            images: BTreeMap::new(),
            counter: 0,
        }
    }

    pub fn add_image(&mut self, image: ImageDraft) -> ImageId {
        let id = ImageId(self.counter);
        self.counter += 1;
        let image = Image {
            id,
            title: image.title,
            description: image.description,
            status: Status::ToDo,
        };
        self.images.insert(id, image);
        id
    }

    pub fn get(&self, id: ImageId) -> Option<&Image> {
        self.images.get(&id)
    }

    pub fn get_mut(&mut self, id: ImageId) -> Option<&mut Image> {
        self.images.get_mut(&id)
    }
}

impl Index<ImageId> for ImageStore {
    type Output = Image;

    fn index(&self, index: ImageId) -> &Self::Output {
        self.get(index).unwrap()
    }
}

impl Index<&ImageId> for ImageStore {
    type Output = Image;

    fn index(&self, index: &ImageId) -> &Self::Output {
        &self[*index]
    }
}

impl IndexMut<ImageId> for ImageStore {
    fn index_mut(&mut self, index: ImageId) -> &mut Self::Output {
        self.get_mut(index).unwrap()
    }
}

impl IndexMut<&ImageId> for ImageStore {
    fn index_mut(&mut self, index: &ImageId) -> &mut Self::Output {
        &mut self[*index]
    }
}

impl<'a> IntoIterator for &'a ImageStore {
    type Item = &'a Image;
    type IntoIter = std::collections::btree_map::Values<'a, ImageId, Image>;

    fn into_iter(self) -> Self::IntoIter {
        self.images.values()
    }
}
