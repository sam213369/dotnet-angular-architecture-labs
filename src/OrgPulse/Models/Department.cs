using System.ComponentModel.DataAnnotations;

namespace OrgPulse.Models;

public class Department
{
    public int DepartmentId { get; set; }

    [Required]
    public string DepartmentName { get; set; } = string.Empty;
}
