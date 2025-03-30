describe('Meme Generator', () => {
    it('should generate meme image with custom text', () => {
      const topText = 'Top Text';
      const bottomText = 'Bottom Text';
  
      // Visit the meme generator page (using baseUrl from cypress.json)
      cy.visit('/');
  
      // Interact with the form
      cy.get(':nth-child(1) > [style="height: 100px;"] > img').click()
      cy.get('input[id="top-text"]').type("Top Text");
      cy.get('input[id="bottom-text"]').type("Bottom Text");
      cy.get('button').contains('Generate').should('be.visible');
      cy.get('.generate-button').click()
      cy.get('.download-button',).click()
  
      // Assert the meme is generated
      // cy.get('img').should('have.attr', 'src').should('include', 'https://apimeme.com/thumbnail?name=10-Guy');
    });
  });
  