import { Link } from 'react-router-dom';
import './ComingSoon.css';

export default function ComingSoon() {
    return (
        <div className="coming-soon">
            <div className="coming-soon__bg" />

            <div className="coming-soon__shapes">
                <div className="coming-soon__shape coming-soon__shape--1" />
                <div className="coming-soon__shape coming-soon__shape--2" />
            </div>

            <div className="coming-soon__content">
                <div className="coming-soon__badge">
                    <span className="coming-soon__dot" />
                    Status: Under Development
                </div>

                <h1 className="coming-soon__title">
                    <span>Sớm Ra Mắt</span>
                    <span>Trong Năm 2026</span>
                </h1>

                <p className="coming-soon__desc">
                    Chúng tôi đang nỗ lực hoàn thiện những tính năng bảo mật và trải nghiệm người dùng cuối cùng.
                    Hãy sẵn sàng cho một kỷ nguyên điện ảnh mới, bảo mật hơn và đẳng cấp hơn.
                </p>

                <div className="coming-soon__actions">
                    <Link to="/" className="coming-soon__btn coming-soon__btn--primary">
                        Quay lại trang chủ
                    </Link>
                    <Link to="/news" className="coming-soon__btn coming-soon__btn--secondary">
                        Xem tin tức mới
                    </Link>
                </div>

                <div className="coming-soon__info">
                    <div className="coming-soon__stat">
                        <span className="coming-soon__stat-val">90%</span>
                        <span className="coming-soon__stat-label">Hoàn thiện</span>
                    </div>
                    <div className="coming-soon__stat">
                        <span className="coming-soon__stat-val">24/7</span>
                        <span className="coming-soon__stat-label">Hỗ trợ</span>
                    </div>
                    <div className="coming-soon__stat">
                        <span className="coming-soon__stat-val">V1.0</span>
                        <span className="coming-soon__stat-label">Phiên bản</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
