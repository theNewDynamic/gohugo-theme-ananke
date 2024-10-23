describe("Hugo Site Test", () => {
  const hugoBaseUrl = "http://localhost:1313"; // Hugo's default server URL

  it("loads the home page", () => {
    // Start the Hugo server before visiting the site
    cy.exec("hugo server &");
    cy.wait(5000); // Wait for the server to start

    // Visit the local Hugo site
    cy.visit(hugoBaseUrl);

    // Check for page elements (Ananke theme specific)
    cy.contains("h1", "My Test Site").should("be.visible");
    cy.contains("Posts").should("be.visible");

    // Clean up server after test
    cy.exec("killall hugo");
  });

  it("checks if post is available", () => {
    cy.visit(hugoBaseUrl);
    cy.contains("a", "my-first-post").should("be.visible");
  });
});
