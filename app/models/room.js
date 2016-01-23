import uuid from "uuid";
import {entries} from "../../helpers/iterators";

export default class Room {
	constructor() {
		this.id = uuid.v4();
		this.entities = {};
		this.entityCount = 0;
	}
	isFull() {
		return false;
	}
	getNearby(thisEntity, distance) {
		var thisEntity = this.entities[thisEntity.id];
		var distanceSq = distance*distance;
		var returnEntities = [];
		for (let [id, entity] of entries(this.entities)) {
			if (entity !== thisEntity) {
				if (thisEntity.position.distanceSq(entity.position) <= distanceSq) {
					returnEntities.push(entity);
				}
			}
		}
		return returnEntities;
	}
	addEntity(entity) {
		if (this.entities[entity.id]) {
			return false;
		}
		this.entities[entity.id] = entity;
		this.entityCount++;
		return true;
	}
	removeEntity(entity) {
		if (this.entities[entity.id]) {
			delete this.entities[entity.id];
			return true;
		}
		return false;
	}
}
