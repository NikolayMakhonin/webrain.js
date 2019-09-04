import {CalcProperty} from './CalcProperty'

interface ISerializableObservableObject {
	serializableChanged: CalcProperty<number>
}
