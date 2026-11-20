using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using OrgPulse.Models;

namespace OrgPulse.Controllers;

public class HomeController : Controller
{
    private readonly IConfiguration _configuration;

    public HomeController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<IActionResult> Index()
    {
        var departments = new List<Department>();

        await using var connection = new SqlConnection(GetConnectionString());
        await connection.OpenAsync();

        await using var command = new SqlCommand(
            "SELECT DepartmentId, DepartmentName FROM dbo.Departments ORDER BY DepartmentId",
            connection);
        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            departments.Add(new Department
            {
                DepartmentId = reader.GetInt32(0),
                DepartmentName = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
            });
        }

        return View(departments);
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View(new Department());
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(Department department)
    {
        department.DepartmentName = department.DepartmentName?.Trim() ?? string.Empty;
        if (!ModelState.IsValid)
        {
            return View(department);
        }

        await using var connection = new SqlConnection(GetConnectionString());
        await connection.OpenAsync();

        await using var command = new SqlCommand(
            "INSERT INTO dbo.Departments (DepartmentName) VALUES (@DepartmentName);",
            connection);
        command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);
        await command.ExecuteNonQueryAsync();

        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Edit(int id)
    {
        await using var connection = new SqlConnection(GetConnectionString());
        await connection.OpenAsync();

        await using var command = new SqlCommand(
            "SELECT DepartmentId, DepartmentName FROM dbo.Departments WHERE DepartmentId = @DepartmentId;",
            connection);
        command.Parameters.AddWithValue("@DepartmentId", id);

        await using var reader = await command.ExecuteReaderAsync();
        if (!await reader.ReadAsync())
        {
            return NotFound();
        }

        return View(new Department
        {
            DepartmentId = reader.GetInt32(0),
            DepartmentName = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
        });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [Bind("DepartmentName")] Department department)
    {
        department.DepartmentId = id;
        department.DepartmentName = department.DepartmentName?.Trim() ?? string.Empty;
        if (!ModelState.IsValid)
        {
            return View(department);
        }

        await using var connection = new SqlConnection(GetConnectionString());
        await connection.OpenAsync();

        await using var command = new SqlCommand(
            "UPDATE dbo.Departments SET DepartmentName = @DepartmentName WHERE DepartmentId = @DepartmentId;",
            connection);
        command.Parameters.AddWithValue("@DepartmentName", department.DepartmentName);
        command.Parameters.AddWithValue("@DepartmentId", id);

        if (await command.ExecuteNonQueryAsync() == 0)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        await using var connection = new SqlConnection(GetConnectionString());
        await connection.OpenAsync();

        await using var command = new SqlCommand(
            "DELETE FROM dbo.Departments WHERE DepartmentId = @DepartmentId;",
            connection);
        command.Parameters.AddWithValue("@DepartmentId", id);

        if (await command.ExecuteNonQueryAsync() == 0)
        {
            return NotFound();
        }

        return RedirectToAction(nameof(Index));
    }

    public IActionResult Privacy()
    {
        return View();
    }

    private string GetConnectionString()
    {
        return _configuration.GetConnectionString("CompanyDB")
            ?? throw new InvalidOperationException("Connection string 'CompanyDB' was not found.");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
