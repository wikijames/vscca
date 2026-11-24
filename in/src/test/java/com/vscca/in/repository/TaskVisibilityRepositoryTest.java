package com.vscca.in.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.h2.api.Interval;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.jpa.repository.Query;

public class TaskVisibilityRepositoryTest {
    private static final String USER = "assignee@example.invalid";
    private static final String OTHER_USER = "other@example.invalid";
    private static final String OPEN = "InProcess";
    private static final String DONE = "Done";

    private Connection database;
    private LocalDate today;

    @BeforeEach
    void createSyntheticSchema() throws SQLException {
        database = DriverManager.getConnection("jdbc:h2:mem:;MODE=MySQL");
        try (Statement statement = database.createStatement()) {
            statement.execute("CREATE SCHEMA vscca");
            statement.execute("CREATE TABLE vscca.task_info (id BIGINT PRIMARY KEY, project_name VARCHAR(100),"
                    + " party_name VARCHAR(100), weightage INT, task_description VARCHAR(100), task_type VARCHAR(100),"
                    + " billing_client VARCHAR(100), created_at TIMESTAMP(6), due_date TIMESTAMP(6))");
            statement.execute("CREATE TABLE vscca.task_status (task_id BIGINT, status VARCHAR(100),"
                    + " delay_reason VARCHAR(100), remarks VARCHAR(100), end_date TIMESTAMP(6))");
            statement.execute("CREATE TABLE vscca.task_user_details (task_id BIGINT, responsibility VARCHAR(100),"
                    + " intimation VARCHAR(100), exceution VARCHAR(100), consulting VARCHAR(100))");
            statement.execute("CREATE ALIAS DATE_ADD FOR '" + getClass().getName() + ".dateAdd'");
            database.setAutoCommit(false);
            try (ResultSet result = statement.executeQuery("SELECT CURDATE()")) {
                result.next();
                today = result.getObject(1, LocalDate.class);
            }
        }
    }

    // H2 uses a Java alias for MySQL's date addition while executing the repository SQL.
    public static LocalDate dateAdd(LocalDate date, Interval interval) {
        return date.plusDays(interval.getDays());
    }

    @AfterEach
    void closeDatabase() throws SQLException {
        if (database != null) {
            database.close();
        }
    }

    @Test
    void allTasksIncludeOverdueAndTheCutoffButExcludeLaterAndCompletedTasks() throws Exception {
        addTask(1, today.minusDays(3).atStartOfDay(), OPEN);
        addTask(2, today.plusDays(59).atStartOfDay(), OPEN);
        addTask(3, today.plusDays(59).atTime(12, 0), OPEN);
        addTask(4, today.plusDays(60).atStartOfDay(), OPEN);
        addTask(5, today.atStartOfDay(), DONE);
        addTask(6, null, OPEN);

        assertEquals(Arrays.asList(1L, 2L), taskIds("findTaskDetails"));
    }

    @Test
    void userTasksIncludeEachAssignmentTypeAndExcludeUnassignedOrCompletedTasks() throws Exception {
        addTask(1, today.minusDays(3).atStartOfDay(), OPEN, USER, OTHER_USER, OTHER_USER, OTHER_USER);
        addTask(2, today.plusDays(58).atStartOfDay(), OPEN, OTHER_USER, USER, OTHER_USER, OTHER_USER);
        addTask(3, today.plusDays(59).atStartOfDay(), OPEN, OTHER_USER, OTHER_USER, USER, OTHER_USER);
        addTask(4, today.plusDays(59).atStartOfDay(), OPEN, OTHER_USER, OTHER_USER, OTHER_USER, USER);
        addTask(5, today.plusDays(60).atStartOfDay(), OPEN, USER, USER, USER, USER);
        addTask(6, today.atStartOfDay(), DONE, USER, USER, USER, USER);
        addTask(7, today.atStartOfDay(), OPEN);

        List<Long> visible = taskIds("findTaskDetailsByUser", USER);
        visible.sort(Long::compareTo);
        assertEquals(Arrays.asList(1L, 2L, 3L, 4L), visible);
    }

    @Test
    void assignmentQueriesApplyTheirOwnAssignmentAndTheSameCutoff() throws Exception {
        addTask(1, today.plusDays(59).atStartOfDay(), OPEN, OTHER_USER, USER, OTHER_USER, OTHER_USER);
        addTask(2, today.plusDays(59).atStartOfDay(), OPEN, OTHER_USER, OTHER_USER, USER, OTHER_USER);
        addTask(3, today.plusDays(59).atStartOfDay(), OPEN, OTHER_USER, OTHER_USER, OTHER_USER, USER);
        addTask(4, today.plusDays(60).atStartOfDay(), OPEN, USER, USER, USER, USER);
        addTask(5, today.atStartOfDay(), OPEN, USER, OTHER_USER, OTHER_USER, OTHER_USER);

        assertEquals(Arrays.asList(1L), taskIds("findTaskDetailsIntimation", USER));
        assertEquals(Arrays.asList(2L), taskIds("findTaskDetailsExceution", USER));
        assertEquals(Arrays.asList(3L), taskIds("findTaskDetailsConsulting", USER));
    }

    private void addTask(long id, LocalDateTime dueDate, String status) throws SQLException {
        addTask(id, dueDate, status, OTHER_USER, OTHER_USER, OTHER_USER, OTHER_USER);
    }

    private void addTask(long id, LocalDateTime dueDate, String status, String responsibility,
            String intimation, String execution, String consulting) throws SQLException {
        execute("INSERT INTO vscca.task_info (id, due_date) VALUES (?, ?)", id, dueDate);
        execute("INSERT INTO vscca.task_status (task_id, status, end_date) VALUES (?, ?, ?)",
                id, status, today.atStartOfDay());
        execute("INSERT INTO vscca.task_user_details VALUES (?, ?, ?, ?, ?)",
                id, responsibility, intimation, execution, consulting);
    }

    private void execute(String sql, Object... parameters) throws SQLException {
        try (PreparedStatement statement = database.prepareStatement(sql)) {
            for (int index = 0; index < parameters.length; index++) {
                statement.setObject(index + 1, parameters[index]);
            }
            statement.executeUpdate();
        }
    }

    private List<Long> taskIds(String methodName, String... assignee) throws Exception {
        Class<?>[] parameterTypes = assignee.length == 0 ? new Class<?>[0] : new Class<?>[] { String.class };
        Query query = TaskInfoRepository.class.getMethod(methodName, parameterTypes).getAnnotation(Query.class);
        List<Long> ids = new ArrayList<>();
        // H2 requires quotes around an interval literal. Keep the original value and predicate.
        String sql = query.value().replaceAll("\\bINTERVAL\\s+(\\d+)\\s+DAY\\b", "INTERVAL '$1' DAY");
        try (PreparedStatement statement = database.prepareStatement(sql)) {
            if (assignee.length > 0) {
                statement.setString(1, assignee[0]);
            }
            try (ResultSet rows = statement.executeQuery()) {
                while (rows.next()) {
                    ids.add(rows.getLong(1));
                }
            }
        }
        return ids;
    }
}
