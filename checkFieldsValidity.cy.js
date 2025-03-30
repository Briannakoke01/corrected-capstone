describe('Check Fields Validity', () => {
    it('should check if input fields and generate button are visible', () => {
      // Visit the meme generator page
      cy.visit('/');
  
      // Check if the top text input field is visible
      cy.get('input[id="top-text"]').should('be.visible');
  
      // Check if the bottom text input field is visible
      cy.get('input[id="bottom-text"]').should('be.visible');
  
      // Check if the "Generate" button is visible
      cy.get('button').contains('Generate').should('be.visible');
    });
  });
  