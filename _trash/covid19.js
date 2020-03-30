// region find polynom roots

function nextPow2(v) {
	v += v === 0
	--v
	v |= v >>> 1
	v |= v >>> 2
	v |= v >>> 4
	v |= v >>> 8
	v |= v >>> 16
	return v + 1
}

var EPSILON = 1e-10

var pr = new Float64Array(1024)
var pi = new Float64Array(1024)


function near(a, b, c, d, tol) {
	var qa = a - c
	var qb = b - d
	var r = qa * qa + qb * qb
	if(r * r < tol) {
		return true
	}
	return false
}

function solve(n, n_iters, tolerance, zr, zi) {
	var m = zr.length
	var i, j, k, a, b, na, nb, pa, pb, qa, qb, k1, k2, k3, s1, s2, t, d, r
	var max = Math.max, abs = Math.abs
	for(i=0; i<n_iters; ++i) {
		d = 0.0
		for(j=0; j<m; ++j) {
			//Read in zj
			pa = zr[j]
			pb = zi[j]

			//Compute denominator
			//
			//  (zj - z0) * (zj - z1) * ... * (zj - z_{n-1})
			//
			a = 1.0
			b = 0.0
			for(k=0; k<m; ++k) {
				if(k === j) {
					continue
				}
				qa = pa - zr[k]
				qb = pb - zi[k]
				if(qa * qa + qb * qb < tolerance) {
					continue
				}
				k1 = qa * (a + b)
				k2 = a * (qb - qa)
				k3 = b * (qa + qb)
				a = k1 - k3
				b = k1 + k2
			}

			//Compute numerator
			na = pr[n-1]
			nb = pi[n-1]
			s1 = pb - pa
			s2 = pa + pb
			for(k=n-2; k>=0; --k) {
				k1 = pa * (na + nb)
				k2 = na * s1
				k3 = nb * s2
				na = k1 - k3 + pr[k]
				nb = k1 + k2 + pi[k]
			}


			//Compute reciprocal
			k1 = a*a + b*b
			if(abs(k1) > EPSILON) {
				a /=  k1
				b /= -k1
			} else {
				a = 1.0
				b = 0.0
			}

			//Multiply and accumulate
			k1 = na * (a + b)
			k2 = a * (nb - na)
			k3 = b * (na + nb)

			qa = k1 - k3
			qb = k1 + k2

			zr[j] = pa - qa
			zi[j] = pb - qb

			d = max(d, max(abs(qa), abs(qb)))
		}

		//If converged, exit early
		if(d < tolerance) {
			break
		}
	}

	//Post process: Combine any repeated roots
	var count
	for(i=0; i<m; ++i) {
		count = 1
		a = zr[i]
		b = zi[i]
		for(j=0; j<m; ++j) {
			if(i === j) {
				continue
			}
			if(near(zr[i], zi[i], zr[j], zi[j], tolerance)) {
				++count
				a += zr[j]
				b += zi[j]
			}
		}
		if(count > 1) {
			a /= count
			b /= count
			for(j=0; j<m; ++j) {
				if(i === j) {
					continue
				}
				if(near(zr[i], zi[i], zr[j], zi[j], tolerance)) {
					zr[j] = a
					zi[j] = b
				}
			}
			zr[i] = a
			zi[i] = b
		}
	}
	return [ zr, zi ]
}

function bound(n) {
	var i, b = 0.0
	for(i=0; i<n; ++i) {
		b = Math.max(b, pr[i] * pr[i] + pi[i] * pi[i])
	}
	return 1.0 + Math.sqrt(b)
}

function findRoots(r_coeff, i_coeff, n_iters, tolerance, zr, zi) {
	var n = r_coeff.length, i
	if(n <= 1) {
		return []
	}
	if(pr.length < n) {
		var nl = nextPow2(n)
		pr = new Float64Array(nl)
		pi = new Float64Array(nl)
	}
	for(i=0; i<n; ++i) {
		pr[i] = r_coeff[i]
	}
	if(!i_coeff) {
		for(i=0; i<n; ++i) {
			pi[i] = 0.0
		}
	} else {
		for(i=0; i<n; ++i) {
			pi[i] = i_coeff[i]
		}
	}
	//Rescale coefficients
	var a = pr[n-1], b = pi[n-1]
	var d = a*a + b*b
	a /= d
	b /= -d
	var k1, k2, k3, s = b - a, t = a + b
	for(var i=0; i<n-1; ++i) {
		k1 = a * (pr[i] + pi[i])
		k2 = pr[i] * s
		k3 = pi[i] * t
		pr[i] = k1 - k3
		pi[i] = k1 + k2
	}
	pr[n-1] = 1.0
	pi[n-1] = 0.0
	if(!n_iters) {
		n_iters = 100 * n
	}
	if(!tolerance) {
		tolerance = 1e-6
	}
	//Pick default initial guess if unspecified
	if(!zr) {
		zr = new Array(n-1)
		zi = new Array(n-1)
		var r = bound(n), t, c
		for(i=0; i<n-1; ++i) {
			t = Math.random() * r
			c = Math.cos(Math.random() * 2 * Math.PI)
			zr[i] = t * c
			zi[i] = t * Math.sqrt(1.0 - c*c)
		}
	} else if(!zi) {
		zi = new Array(zr.length)
		for(i=0; i<zi.length; ++i) {
			zi[i] = 0.0
		}
	}
	return solve(n, n_iters, tolerance, zr, zi)
}

function findRealRoots(coeffs, iters) {
	const n = coeffs.length
	const roots = findRoots(coeffs, null, (iters || 100) * n, EPSILON * 10)
	const realRoots = []
	for (let i = 0, len = roots[0].length; i < len; i++) {
		if (Math.abs(roots[0][i]) < 1e-4) {
			roots[0][i] = 0
		}
		if (Math.abs(roots[1][i]) < 1e-4) {
			roots[1][i] = 0
		}
		if (roots[1][i] === 0) {
			realRoots.push(roots[0][i])
		}
	}
	return realRoots
}

// endregion

// region Nelder-Mead

function dot(a, b) {
    var ret = 0;
    for (var i = 0; i < a.length; ++i) {
        ret += a[i] * b[i];
    }
    return ret;
}

function norm2(a)  {
    return Math.sqrt(dot(a, a));
}

function weightedSum(ret, w1, v1, w2, v2) {
    for (var j = 0; j < ret.length; ++j) {
        ret[j] = w1 * v1[j] + w2 * v2[j];
    }
}

function nelderMead(f, x0, parameters) {
    parameters = parameters || {};

    var maxIterations = parameters.maxIterations || x0.length * 200,
        nonZeroDelta = parameters.nonZeroDelta || 1.05,
        zeroDelta = parameters.zeroDelta || 0.001,
        minErrorDelta = parameters.minErrorDelta || 1e-6,
        minTolerance = parameters.minErrorDelta || 1e-5,
        rho = (parameters.rho !== undefined) ? parameters.rho : 1,
        chi = (parameters.chi !== undefined) ? parameters.chi : 2,
        psi = (parameters.psi !== undefined) ? parameters.psi : -0.5,
        sigma = (parameters.sigma !== undefined) ? parameters.sigma : 0.5,
        maxDiff;

    // initialize simplex.
    var N = x0.length,
        simplex = new Array(N + 1);
    simplex[0] = x0;
    simplex[0].fx = f(x0);
    simplex[0].id = 0;
    for (var i = 0; i < N; ++i) {
        var point = x0.slice();
        point[i] = point[i] ? point[i] * nonZeroDelta : zeroDelta;
        simplex[i+1] = point;
        simplex[i+1].fx = f(point);
        simplex[i+1].id = i+1;
    }

    function updateSimplex(value) {
        for (var i = 0; i < value.length; i++) {
            simplex[N][i] = value[i];
        }
        simplex[N].fx = value.fx;
    }

    var sortOrder = function(a, b) { return a.fx - b.fx; };

    var centroid = x0.slice(),
        reflected = x0.slice(),
        contracted = x0.slice(),
        expanded = x0.slice();

    for (var iteration = 0; iteration < maxIterations; ++iteration) {
        simplex.sort(sortOrder);

        if (parameters.history) {
            // copy the simplex (since later iterations will mutate) and
            // sort it to have a consistent order between iterations
            var sortedSimplex = simplex.map(function (x) {
                var state = x.slice();
                state.fx = x.fx;
                state.id = x.id;
                return state;
            });
            sortedSimplex.sort(function(a,b) { return a.id - b.id; });

            parameters.history.push({x: simplex[0].slice(),
                                     fx: simplex[0].fx,
                                     simplex: sortedSimplex});
        }

        maxDiff = 0;
        for (i = 0; i < N; ++i) {
            maxDiff = Math.max(maxDiff, Math.abs(simplex[0][i] - simplex[1][i]));
        }

        if ((Math.abs(simplex[0].fx - simplex[N].fx) < minErrorDelta) &&
            (maxDiff < minTolerance)) {
            break;
        }

        // compute the centroid of all but the worst point in the simplex
        for (i = 0; i < N; ++i) {
            centroid[i] = 0;
            for (var j = 0; j < N; ++j) {
                centroid[i] += simplex[j][i];
            }
            centroid[i] /= N;
        }

        // reflect the worst point past the centroid  and compute loss at reflected
        // point
        var worst = simplex[N];
        weightedSum(reflected, 1+rho, centroid, -rho, worst);
        reflected.fx = f(reflected);

        // if the reflected point is the best seen, then possibly expand
        if (reflected.fx < simplex[0].fx) {
            weightedSum(expanded, 1+chi, centroid, -chi, worst);
            expanded.fx = f(expanded);
            if (expanded.fx < reflected.fx) {
                updateSimplex(expanded);
            }  else {
                updateSimplex(reflected);
            }
        }

        // if the reflected point is worse than the second worst, we need to
        // contract
        else if (reflected.fx >= simplex[N-1].fx) {
            var shouldReduce = false;

            if (reflected.fx > worst.fx) {
                // do an inside contraction
                weightedSum(contracted, 1+psi, centroid, -psi, worst);
                contracted.fx = f(contracted);
                if (contracted.fx < worst.fx) {
                    updateSimplex(contracted);
                } else {
                    shouldReduce = true;
                }
            } else {
                // do an outside contraction
                weightedSum(contracted, 1-psi * rho, centroid, psi*rho, worst);
                contracted.fx = f(contracted);
                if (contracted.fx < reflected.fx) {
                    updateSimplex(contracted);
                } else {
                    shouldReduce = true;
                }
            }

            if (shouldReduce) {
                // if we don't contract here, we're done
                if (sigma >= 1) break;

                // do a reduction
                for (i = 1; i < simplex.length; ++i) {
                    weightedSum(simplex[i], 1 - sigma, simplex[0], sigma, simplex[i]);
                    simplex[i].fx = f(simplex[i]);
                }
            }
        } else {
            updateSimplex(reflected);
        }
    }

    simplex.sort(sortOrder);
    return {fx : simplex[0].fx,
            x : simplex[0]};
}

// endregion

// region approximate

function calcPolynom(coefs, value) {
	let sum = 0
	for (let i = 0, len = coefs.length; i < len; i++) {
		sum += coefs[i] * Math.pow(value, i)
	}
	return sum
}

function diffSquare(f, X, Y, countDotsBetween = 10) {
	const count = X.length
	let sum = 0
	let x0 = X[0]
	let y0 = Y[0]
	let step = 1 / countDotsBetween
	for (let i = 1; i < count; i++) {
		const x1 = X[i]
		const y1 = Y[i]
		const dx = (x1 - x0) * step
		const dy = (y1 - y0) * step
		for (let j = i === 1 ? 0 : 1; j <= countDotsBetween; j++) {
			const x = x0 + dx * j
			const y = y0 + dy * j
			const diff = f(x) - y
			sum += diff * diff
		}
	}
	return sum / (count * countDotsBetween)
}

function approximate(f, X, Y, coefs0) {
	let coefs
	function _f(x) {
		return f(coefs, x)
	}

	return nelderMead(o => {
		coefs = o
		return diffSquare(_f, X, Y)
	}, coefs0)
}

function approximatePolynom(X, Y, order) {
	const coefs0 = []
	for (let i = 0; i < order; i++) {
		coefs0[i] = 0
	}

	const coefs = approximate(calcPolynom, X, Y, coefs0)

	return coefs
}

// endregion

function lastZeroIndex(arr, epsilon) {
	let i = arr.length - 1
	for (; i >= 0; i--) {
		if (Math.abs(arr[i]) > epsilon) {
			break
		}
	}
	return i + 1
}

function fixCoefs(coefs) {
	let newCoefs = []
	let factorial = 1
	for (let i = 0, len = coefs.length; i < len; i++) {
		if (i > 1) {
			factorial *= i
		}
		newCoefs[i] = coefs[i] / factorial
	}
	return newCoefs
}

function calcRoots(coefs) {
	let roots = findRealRoots(coefs, 1000)
	roots = roots.filter(o => o >= 0)

	for (let i = 0, len = roots.length; i < len; i++) {
		const check = calcPolynom(coefs, roots[i])
		if (Math.abs(check) > 1e-5) {
			debugger
		}
	}

	return roots
}

const MAX_FORECAST_DAYS = 30

function calcForecast(arr, forecastDays, day) {
	const index = lastZeroIndex(arr, 1e-2)

	let roots

	roots = index >= 4
		? calcRoots(arr.slice(2, index))
		: []

	let type
	if (roots.length === 0) {
		type = 'end'
		roots = index >= 3
			? calcRoots(fixCoefs(arr.slice(1, index)))
			: []
		if (roots.length === 0) {
			return [`${forecastDays} days`, calcPolynom(fixCoefs(arr), forecastDays + day)]
		}
	} else {
		type = 'middle'
	}

	roots = roots.map(o => o + day)

	return [type, ...roots
		.map(o => Math.round(o))]
}

async function covid19() {
	const MAX_SPEED_ORDER = MAX_FORECAST_DAYS
	const SMOOTH_DAYS = 7
	try {
		const data = JSON.parse(await (await fetch('https://pomber.github.io/covid19/timeseries.json')).text())
		const reportsArray = []
		for (const countryName in data) {
			if (Object.prototype.hasOwnProperty.call(data, countryName)) {
				const countryData = data[countryName]
				const len = countryData.length - 1 // without last day

				const report = {
					country: countryName,
				}
				reportsArray.push(report)

				const speeds = []
				const sum = []
				const smooth = []
				const growth = []
				for (let j = 0; j <= MAX_SPEED_ORDER; j++) {
					sum.push(0)
				}

				report.values = []
				report.speeds = speeds
				report.smooth = smooth
				report.growth = growth
				for (let i = 0; i < len; i++) {
					let value = countryData[i].confirmed
					report.values[i] = value

					let speeds_i = speeds[i]
					if (speeds_i == null) {
						speeds[i] = speeds_i = []
					}

					let smooth_i = smooth[i]
					if (smooth_i == null) {
						smooth[i] = smooth_i = []
					}

					const maxSpeedOrder = Math.min(i, MAX_SPEED_ORDER)
					for (let j = 0; j <= maxSpeedOrder; j++) {
						if (j === 0) {
							speeds_i[j] = value
						} else {
							speeds_i[j] = smooth_i[j - 1] - smooth[i - 1][j - 1]
						}
						if (j === 2 && i >= 2) {
							const prev = smooth[i - 1][0] - smooth[i - 2][0]
							growth[i] = prev && prev > 1
								? (smooth[i][0] - smooth[i - 1][0]) / prev
								: 0
						}
						if (!Number.isFinite(speeds_i[j])) {
							debugger
						}

						sum[j] += speeds_i[j]
						if (i - j >= SMOOTH_DAYS) {
							sum[j] -= speeds[i - SMOOTH_DAYS][j]
							if (!Number.isFinite(sum[j])) {
								debugger
							}
						}
						smooth_i[j] = sum[j] / Math.min(i - j + 1, SMOOTH_DAYS)
					}
				}
				report.values = report.values.reverse()
				report.speeds = report.speeds.reverse()
				report.smooth = report.smooth.reverse()
				report.growth = report.growth.reverse()
			}
		}

		reportsArray.sort((o1, o2) => {
			// return o1.smooth[0][2] < o2.smooth[0][2]
			// 	? 1
			// 	: -1
			return o1.country > o2.country
				? 1
				: -1
		})

		const reports = {}

		for (let n = 0; n < reportsArray.length; n++) {
			const growth = reportsArray[n].growth
			const report = reportsArray[n].smooth
				.map((o, i) => {
					const result = [i, reportsArray[n].values[i], o[0]]
					const day = 0 // -i - 1
					result.push.apply(result, calcForecast(o, 3, day))
					result.push.apply(result, calcForecast(o, 7, day))
					result.push.apply(result, calcForecast(o, 14, day))
					result.push.apply(result, calcForecast(o, 21, day))
					result.push.apply(result, calcForecast(o, 28, day))
					return result
				})
				.filter(o => o)

			if (report.length && report[0][0] <= 3 && report[0][1] > 20) {
				reports[reportsArray[n].country] = report
			}
		}

		console.log(reportsArray
			.map(o => {
				return [o.values[0], o.country, ...o.speeds.map(o => o[1])]
			})
			.map(o => o.join('\t'))
			.join('\r\n'))

		console.log(reportsArray
			.map(o => {
				return [o.values[0], o.country, ...o.growth]
			})
			.map(o => o.join('\t'))
			.join('\r\n'))

		// console.log(data)
		// console.log(reports)
	} catch (ex) {
		console.error(ex)
	}
}
await covid19()
