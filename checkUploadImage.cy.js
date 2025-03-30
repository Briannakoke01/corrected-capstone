describe('Meme Generator - Image Upload', () => {
    it('should upload an image from the PC', () => {
      // Visit the meme generator page
      cy.visit('/');
  
      // Ensure the file input field is visible
      cy.get('input[type="file"]').should('be.visible');
  
      // Simulate uploading an image from the 'fixtures/images' folder
      cy.get('input[type="file"]').attachFile('images/chota.jpg'); // Ensure the file is in 'cypress/fixtures/images'
  
      // Optionally, check if the image preview is visible (if your app displays it)
    //   cy.get('img').should('have.attr', 'src').and('include', 'chota.jpg');
  
      // Or check for any confirmation message or state change (adjust for your app)
     
    });
  });
  