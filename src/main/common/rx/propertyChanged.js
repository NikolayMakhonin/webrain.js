import {BehaviorSubject} from './subjects/behavior'
import {hasSubscribers} from './subjects/hasSubscribers'
import {unsubscribeValue} from './subjects/unsubscribeValue'
import {createSubjectClass} from './subjects/subject'

const HasSubscribersSubject = unsubscribeValue(BehaviorSubject)

export const PropertyChangedSubject  = createSubjectClass(
	// eslint-disable-next-line no-shadow
	base => hasSubscribers(base, hasSubscribers => {
		const subject = new HasSubscribersSubject()
		subject.value = hasSubscribers
		return subject
	}),
	// eslint-disable-next-line no-shadow
	base => class PropertyChangedSubject extends base {

	}
)
