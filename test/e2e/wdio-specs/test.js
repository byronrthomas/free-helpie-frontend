describe('when on the home page', () => {
  it('should find the login button', () => {
    browser.url('/')
    console.log(browser.getText('.btn*=L'))
  })
})

