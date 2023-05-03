import {useStorage} from "./index";

describe('test-name', () => {
  // const jack = useStorage('jack');

  it('should ', function () {
    localStorage.clear();
    expect(useStorage('jack', 'defaultValue').value).toBe('defaultValue')
  });

  it('should ', function () {
    localStorage.clear();
    let jack = useStorage('jack', 'defaultValue')
    jack.value = 'jack'
    expect(jack.value).toBe('jack')
    jack.value = null
    expect(jack.value).toBe(null)
    expect(localStorage.getItem('__use_storage_jack')).toBe(null)
  });

  it('should ', function () {
    localStorage.clear();
    localStorage.setItem('__use_storage_jack', JSON.stringify({name: 'jack'}));
    let jack = useStorage('jack', {age: 19})
    // expect(jack.value.name).toBe('jack')
    expect(jack.value.age).toBe(19)
    jack.value.name = 'tom'
    expect(jack.value.name).toBe('tom')
  });

  it('should ', function () {
    localStorage.clear();
    debugger
    let jack = useStorage('jack', {address: {city: 'shanghai', street: 'nanjing road'}})
    expect(jack.value.address.city).toBe('shanghai')
    expect(jack.value.address.street).toBe('nanjing road')
    jack.value.name = 'tom'
    expect(jack.value.name).toBe('tom')
    jack.value.address = {city: 'beijing', street: 'yuquan road'}

    expect(jack.value.address.city).toBe('beijing')
    expect(jack.value.address.street).toBe('yuquan road')

    // @ts-ignore
    let jackFromStorage = JSON.parse(localStorage.getItem('__use_storage_jack'))
    expect(jackFromStorage.address.city).toBe('beijing')
    expect(jackFromStorage.address.street).toBe('yuquan road')


  });

})


//alt + shift + g
