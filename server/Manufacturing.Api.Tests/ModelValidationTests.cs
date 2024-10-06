namespace Manufacturing.Api.Tests;

public class ModelValidationTests
{
    // [Test]
    // public void User_ShouldFailValidation_WhenEmailIsNotValid()
    // {
    //     var model = new User() { Email = "This.is.not.an.email" };
    //     var validationResult = ModelValidationHelper.ValidateModel(model);
    //     Assert.That(validationResult, Is.Not.Empty);
    //     Assert.That(validationResult.Any(e => e.ErrorMessage.ToLower().Contains("email")));
    // }
    //
    // [Test]
    // public void User_ShouldBePassValidation_WhenEmailIsValid()
    // {
    //     var model = new User { Name = "tlu", Email = "tlu@visma.dk" };
    //     var modelDTO = new UserDTO() { Name = "tlu", Email = "tlu@visma.dk" };
    //     Assert.That(ModelValidationHelper.ValidateModel(model), Is.Empty);
    //     Assert.That(ModelValidationHelper.ValidateModel(modelDTO), Is.Empty);
    // }
    //
    // [Test]
    // public void TimeRegistration_ShouldBePassValidation_WhenMinsIs30rAbove([Values(30, 120, 320)] int mins)
    // {
    //     Assert.That(ModelValidationHelper.ValidateModel(new TimeRegistration { Mins = mins }), Is.Empty);
    //     Assert.That(ModelValidationHelper.ValidateModel(new TimeRegistrationDTO { Mins = mins }), Is.Empty);
    // }
    //
    // [Test]
    // public void TimeRegistration_ShouldFailValidation_WhenMinsIsBelow30([Values(29, -12, 15)] int mins)
    // {
    //     Assert.That(ModelValidationHelper.ValidateModel(new TimeRegistration { Mins = mins }), Is.Not.Empty);
    //     Assert.That(ModelValidationHelper.ValidateModel(new TimeRegistrationDTO { Mins = mins }), Is.Not.Empty);
    // }
}