package app.ongi.sharing.room;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;

public interface RoomRepository extends JpaRepository<Room, UUID> {
    boolean existsByCode(String code);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select room from Room room join fetch room.questionSet where room.code = :code")
    Optional<Room> findByCodeForUpdate(@Param("code") String code);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select room from Room room join fetch room.questionSet where room.id = :roomId")
    Optional<Room> findByIdForUpdate(@Param("roomId") UUID roomId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from Room room where room.status <> app.ongi.sharing.room.RoomStatus.COMPLETED and room.expiresAt <= :now")
    int deleteExpiredActiveRooms(@Param("now") java.time.Instant now);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("delete from Room room where room.status = app.ongi.sharing.room.RoomStatus.COMPLETED and room.completedAt <= :cutoff")
    int deleteCompletedTombstones(@Param("cutoff") java.time.Instant cutoff);
}
