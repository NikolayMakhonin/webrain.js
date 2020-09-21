namespace Module<T> {

}

function f<T2>(arg: T2): T2
function f<T1, T2>(arg: T2): T2 {
	return null
}

const x = f<boolean>(1)
