export async function delay(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
}
