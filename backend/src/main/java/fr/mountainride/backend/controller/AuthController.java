package fr.mountainride.backend.controller;

import fr.mountainride.backend.domain.Employee;
import fr.mountainride.backend.dto.AuthRequestDTO;
import fr.mountainride.backend.dto.AuthResponseDTO;
import fr.mountainride.backend.repository.EmployeeRepository;
import fr.mountainride.backend.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(EmployeeRepository employeeRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request) {
        return employeeRepository.findByEmail(request.getEmail())
                .filter(employee -> passwordEncoder.matches(request.getPassword(), employee.getPassword()))
                .map(employee -> {
                    String token = jwtUtil.generateToken(employee.getEmail(), employee.getRole());
                    return ResponseEntity.ok(new AuthResponseDTO(
                            token,
                            employee.getEmail(),
                            employee.getFirstName(),
                            employee.getLastName(),
                            employee.getRole()
                    ));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
