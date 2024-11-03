/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Delete } from 'lucide-react'
import { useEffect, useState } from 'react'

const specialButtons = [
  {
    key: 'x',
    label: 'x'
  },
  {
    key: 'π',
    label: 'π'
  },
  {
    key: 'e',
    label: 'e'
  },
  {
    key: 'sin',
    label: 'sin'
  },
  {
    key: 'cos',
    label: 'cos'
  },
  {
    key: '(',
    label: '('
  },
  {
    key: ')',
    label: ')'
  },
  {
    key: '+',
    label: '+'
  },
  {
    key: '-',
    label: '-'
  },
  {
    key: '*',
    label: '×'
  },
  {
    key: '/',
    label: '÷'
  },
  {
    key: '^',
    label: 'xⁿ'
  },
  {
    key: '.',
    label: '.'
  },
  {
    key: 'log(',
    label: 'log'
  },
  {
    key: 'ln(',
    label: 'ln'
  }
]

function App () {
  const [equation, setEquation] = useState('')
  const [x0, setX0] = useState(0)
  const [x1, setX1] = useState(0)

  useEffect(() => {
    console.log('x1:', x1)
  }, [x1])

  useEffect(() => {
    console.log('x0:', x0)
  }, [x0])

  const [tol, setTol] = useState(0.0001)
  const [maxIter, setMaxIter] = useState(100)
  const [result, setResult] = useState('')

  const [steps, setSteps] = useState<{
    iteration: number
    x0: string
    x1: string
    x2: string
    f0: string
    f1: string
    f2: string
  }[]>([])

  const handleCalculate = ({
    equation,
    x0,
    x1,
    tol,
    maxIter
  }: {
    equation: string
    x0: number
    x1: number
    tol: number
    maxIter: number
  }) => {
    try {
      const f = parseEquation(equation)
      const { root, steps } = bisectionMethod(f, x0, x1, tol, maxIter)
      setResult(`${root.toFixed(6)}`)
      setSteps(steps)
    } catch (error) {
      if (error instanceof Error) {
        setResult(error.message)
      } else {
        setResult('An unknown error occurred')
      }
    }
  }

  const bisectionMethod = (
    f: Function,
    x0: number,
    x1: number,
    tol: number,
    maxIter: number
  ) => {
    if (f(x0) * f(x1) >= 0) {
      throw new Error('f(x0) and f(x1) must have opposite signs');
    }

    let x2;
    const steps = [];

    for (let i = 0; i < maxIter; i++) {
      x2 = (x0 + x1) / 2; // Punto medio

      const f0 = f(x0);
      const f1 = f(x1);
      const f2 = f(x2);

      steps.push({
        iteration: i + 1,
        x0: x0.toFixed(6),
        x1: x1.toFixed(6),
        x2: x2.toFixed(6),
        f0: f0.toFixed(6),
        f1: f1.toFixed(6),
        f2: f2.toFixed(6)
      });

      if (Math.abs(f2) < tol || Math.abs(x2 - x0) < tol) {
        return { root: x2, steps };
      }

      if (f0 * f2 < 0) {
        x1 = x2; // La raíz está en el intervalo [x0, x2]
      } else {
        x0 = x2; // La raíz está en el intervalo [x2, x1]
      }
    }

    throw new Error('El método no convergió');
  }

  const parseEquation = (equation: string) => {
    let normalizedEquation = equation.replace(/\^/g, '**')
    normalizedEquation = normalizedEquation.replace(
      /(\d+(\.\d+)?)([xX])/g,
      '$1*$3'
    )
    normalizedEquation = normalizedEquation.replace(/π/g, `(${Math.PI})`) // Reemplaza π
    normalizedEquation = normalizedEquation.replace(/\be\b/g, `(${Math.E})`) // Reemplaza e
    normalizedEquation = normalizedEquation.replace(/log\(/g, 'Math.log10(') // Reemplaza log para base 10
    normalizedEquation = normalizedEquation.replace(/ln\(/g, 'Math.log(') // Reemplaza ln para logaritmo natural

    normalizedEquation = normalizedEquation.replace(/\b(sin|cos)\b/g, 'Math.$1') // Reemplaza sin y cos

    return new Function('x', 'return ' + normalizedEquation + ';')
  }

  const handleClear = () => {
    const input = document.getElementById('x0') as HTMLInputElement
    input.value = ''

    const input2 = document.getElementById('x1') as HTMLInputElement
    input2.value = ''

    const input3 = document.getElementById('tol') as HTMLInputElement
    input3.value = ''

    const input4 = document.getElementById('maxIter') as HTMLInputElement
    input4.value = ''

    setEquation('')
    setResult('')
  }

  const addToEquation = (value: string) => {
    setEquation((prevEquation: string) => {
      const input = document.getElementById('equation') as HTMLInputElement
      const cursorPosition: number | null = input.selectionStart

      if (cursorPosition === null) {
        return prevEquation + value
      }

      const leftSide: string = prevEquation.slice(0, cursorPosition)
      const rightSide: string = prevEquation.slice(cursorPosition)

      return leftSide + value + rightSide
    })

    const input = document.getElementById('equation') as HTMLInputElement
    input.focus()
  }

  const handleInputChange = (e: { target: { value: any } }) => {
    const inputValue = e.target.value
    setEquation(inputValue)
  }


 
  return (
    <>
      <div className=' relative bg-neutral-950  min-h-dvh w-dvw flex  flex-col lg:flex-row gap-4 justify-center items-center p-2 lg:p-6 '>
        <div className=' flex flex-col gap-4'>
          <div className=' p-3 sm:h-[96px] h-auto  bg-neutral-900 w-full flex  flex-col gap-2 rounded-3xl text-white'>
            <div className=' flex justify-between'>
              <h1>
                <strong>Método de Bisección</strong>, creado por:
              </h1>
            </div>
            <ul className=' flex gap-2 flex-wrap justify-center items-center lg:justify-start lg:items-start'>
              {['Ivan Domiguez', 'Uzi Aguero ', 'Emilce Sosa '].map(
                (name, i) => (
                  <li
                    key={i}
                    className='text-white bg-neutral-800 px-3 rounded-xl py-1 text-nowrap'
                  >
                    {name}
                  </li>
                )
              )}
            </ul>
          </div>

          <div className=' border-neutral-500 flex flex-col bg-neutral-900 rounded-3xl'>
            <div className=' flex justify-center items-center flex-col p-4'>
              <h1 className=' text-lg  text-white '>Ecuación</h1>
              <input
                id='equation'
                type='text'
                value={equation}
                onChange={handleInputChange}
                className='bg-neutral-800   text-white p-2 rounded-lg w-full'
                placeholder='Ej: x^3 - x - 2'
              />
              <h1 className=' text-lg text-white'>Intervalo (x0, x1)</h1>
              <div className='flex gap-4 w-full'>
                <input
                  id='x0'
                  type='number'
                  value={x0}
                  onChange={(e) => setX0(parseFloat(e.target.value))}
                  className='bg-neutral-800  text-white p-2 rounded-lg w-full'
                  placeholder='x0'
                />
                <input
                  id='x1'
                  type='number'
                  value={x1}
                  onChange={(e) => setX1(parseFloat(e.target.value))}
                  className='bg-neutral-800 text-white p-2 rounded-lg w-full'
                  placeholder='x1'
                />
              </div>
              <h1 className=' text-lg text-white'>Tolerancia</h1>
              <input
                id='tol'
                type='number'
                value={tol}
                onChange={(e) => setTol(parseFloat(e.target.value))}
                className='bg-neutral-800 text-white p-2 rounded-lg w-full'
                placeholder='Tolerancia'
              />
              <h1 className=' text-lg text-white'>Iteraciones máximas</h1>
              <input
                id='maxIter'
                type='number'
                value={maxIter}
                onChange={(e) => setMaxIter(parseInt(e.target.value))}
                className='bg-neutral-800  text-white p-2 rounded-lg w-full'
                placeholder='Máximas Iteraciones'
              />
              <div className='flex gap-4 w-full mt-4'>
                <button
                  className=' bg-neutral-600 text-white rounded-lg py-2 px-4 w-full'
                  onClick={() =>
                    handleCalculate({
                      equation,
                      x0,
                      x1,
                      tol,
                      maxIter
                    })
                  }
                >
                  Calcular
                </button>
                <button
                  className=' bg-red-600 text-white rounded-lg py-2 px-4 w-full'
                  onClick={handleClear}
                >
                  <Delete /> Limpiar
                </button>
              </div>
              {result && (
                <h1 className=' text-lg text-white mt-4'>
                  Resultado: <strong>{result}</strong>
                </h1>
              )}
            </div>
          </div>

          <div className='flex flex-col'>
            <h1 className='text-lg text-white'>Pasos</h1>
            <div className='overflow-y-scroll h-60 border border-neutral-500 rounded-xl p-4 bg-neutral-900 no-scrollbar'>
              <table className=' table-auto w-full'>
                <thead>
                  <tr className='text-white'>
                    <th>Iteración</th>
                    <th>x0</th>
                    <th>x1</th>
                    <th>x2</th>
                    <th>f(x0)</th>
                    <th>f(x1)</th>
                    <th>f(x2)</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((step, index) => (
                    <tr key={index} className='text-neutral-300'>
                      <td>{step.iteration}</td>
                      <td>{step.x0}</td>
                      <td>{step.x1}</td>
                      <td>{step.x2}</td>
                      <td>{step.f0}</td>
                      <td>{step.f1}</td>
                      <td>{step.f2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='hidden lg:flex flex-col gap-4'>
          {specialButtons.map((button) => (
            <button
              key={button.key}
              className='text-white bg-neutral-800 p-2 rounded-lg'
              onClick={() => addToEquation(button.key)}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
