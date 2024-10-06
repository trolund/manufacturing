namespace Manufacturing.Api.Tests;

public class ProjectsControllerTests
{
    // [Test]
    // public async Task When_AProjectIsCreated_Then_ItShouldReturnCreaded()
    // {
    //     // Arrange
    //     var mockProjectService = new Mock<IProjectService>();
    //     var mockTimeRegistrationService = new Mock<ITimeRegistrationService>();
    //
    //     mockProjectService
    //         .Setup(service => service.AddProjectAsync(It.IsAny<ProjectDTO>()))
    //         .ReturnsAsync(new ProjectDTO() { Name = "Test" });
    //
    //     var controller = new ProjectsController(mockProjectService.Object, mockTimeRegistrationService.Object);
    //
    //     // Act
    //     var result = await controller.Create(new ProjectDTO { Name = "Test" });
    //     var createdResult = result as CreatedAtActionResult;
    //     var createdProject = createdResult.Value as ProjectDTO;
    //
    //     // Assert
    //     Assert.IsNotNull(result);
    //     Assert.That(createdResult.StatusCode, Is.EqualTo(201));
    //     Assert.That(createdProject.Name, Is.EqualTo("Test"));
    // }
}