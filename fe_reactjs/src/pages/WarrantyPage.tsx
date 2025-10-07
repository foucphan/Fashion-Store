import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Security,
  CheckCircle,
  Warning,
  Info,
  Phone,
  Email,
  Schedule,
} from '@mui/icons-material';

export const WarrantyPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          color: '#1976d2', 
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 2
        }}>
          Chính Sách Bảo Hành
        </Typography>
        <Typography variant="h6" sx={{ 
          color: 'text.secondary', 
          textAlign: 'center',
          mb: 4
        }}>
          Cam kết chất lượng sản phẩm và dịch vụ tốt nhất
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 3 }}>
        {/* Thời gian bảo hành */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Schedule sx={{ mr: 2, color: '#1976d2', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Thời Gian Bảo Hành
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Quần áo thời trang: 30 ngày"
                  secondary="Từ ngày mua hàng, áp dụng cho tất cả sản phẩm quần áo"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Giày dép: 90 ngày"
                  secondary="Bảo hành về chất lượng da, keo dán và đế giày"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Phụ kiện: 15 ngày"
                  secondary="Túi xách, ví, thắt lưng và các phụ kiện khác"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Điều kiện bảo hành */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ mr: 2, color: '#1976d2', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Điều Kiện Bảo Hành
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Sản phẩm còn nguyên tem, nhãn mác"
                  secondary="Không được cắt, sửa đổi hoặc làm mất tem bảo hành"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Có hóa đơn mua hàng hợp lệ"
                  secondary="Xuất trình hóa đơn gốc hoặc hóa đơn điện tử"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary="Lỗi từ nhà sản xuất"
                  secondary="Không phải do sử dụng sai cách hoặc tác động bên ngoài"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Các trường hợp không được bảo hành */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Warning sx={{ mr: 2, color: '#f44336', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                Các Trường Hợp Không Được Bảo Hành
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Warning color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Sản phẩm bị hỏng do sử dụng sai cách"
                  secondary="Giặt máy với chế độ không phù hợp, phơi nắng trực tiếp"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Hư hỏng do tác động bên ngoài"
                  secondary="Rách, bẩn, biến dạng do va chạm hoặc tai nạn"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Warning color="error" />
                </ListItemIcon>
                <ListItemText 
                  primary="Sản phẩm đã qua sửa chữa"
                  secondary="Tự ý sửa chữa hoặc sửa chữa tại nơi khác"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Quy trình bảo hành */}
        <Card elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Info sx={{ mr: 2, color: '#1976d2', fontSize: 28 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                Quy Trình Bảo Hành
              </Typography>
            </Box>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Bước 1: Liên hệ hỗ trợ"
                  secondary="Gọi hotline hoặc gửi email với thông tin sản phẩm"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Bước 2: Gửi sản phẩm"
                  secondary="Đóng gói cẩn thận và gửi về địa chỉ cửa hàng"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Bước 3: Kiểm tra và xử lý"
                  secondary="Chúng tôi sẽ kiểm tra và thông báo kết quả trong 3-5 ngày"
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Bước 4: Hoàn thành"
                  secondary="Đổi mới, sửa chữa hoặc hoàn tiền tùy theo tình trạng"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Thông tin liên hệ */}
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
            Thông Tin Liên Hệ
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 2, color: '#1976d2' }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Hotline: 1900 1234
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thứ 2 - Chủ nhật: 8:00 - 22:00
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ mr: 2, color: '#1976d2' }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Email: warranty@fashionstore.com
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phản hồi trong 24h
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
